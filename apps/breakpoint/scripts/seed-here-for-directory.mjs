import { readFile, writeFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

/**
 * Seeds the "Add your 3" typeahead directory from the accounts one or more X
 * users follow. It runs offline with the app-only bearer token, so visitors
 * search the database and the page never calls X.
 *
 *   pnpm here-for:directory --from harkl_            fetch and save
 *   pnpm here-for:directory --from harkl_ --out f.json   fetch to a file only
 *   pnpm here-for:directory --file f.json            save a file fetched earlier
 *   pnpm here-for:directory --file following.csv     save a Name,Handle CSV export
 *   pnpm here-for:directory --file handles.txt       save plain handles, one per line
 *   --reset                                          clear the directory first
 */

const X_API = "https://api.x.com";
const HANDLE = /^[A-Za-z0-9_]{1,15}$/;

const args = process.argv.slice(2);
const values = (flag) =>
  args.flatMap((arg, i) => (arg === flag && args[i + 1] ? [args[i + 1]] : []));
const from = values("--from").map((h) => h.replace(/^@+/, ""));
const [out] = values("--out");
const [file] = values("--file");
if (!from.length && !file)
  throw new Error("Pass --from <handle> to fetch, or --file <json> to import.");
if (from.some((h) => !HANDLE.test(h)))
  throw new Error("--from takes X handles such as harkl_.");

async function x(path) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) throw new Error("X_BEARER_TOKEN must be set to fetch from X.");
  for (;;) {
    const response = await fetch(`${X_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 429) {
      // Wait for the window X reports, then retry the same page.
      const reset = Number(response.headers.get("x-rate-limit-reset")) * 1000;
      const wait = Math.max(5000, reset - Date.now() + 1000);
      console.log(`rate limited, waiting ${Math.ceil(wait / 1000)}s`);
      await new Promise((resolve) => setTimeout(resolve, wait));
      continue;
    }
    const body = await response.json();
    if (!response.ok)
      throw new Error(`X ${path} ${response.status} ${JSON.stringify(body)}`);
    return body;
  }
}

async function following(handle) {
  const { data: user } = await x(`/2/users/by/username/${handle}`);
  const people = [];
  let page = "";
  do {
    const body = await x(
      `/2/users/${user.id}/following?max_results=1000&user.fields=public_metrics${
        page ? `&pagination_token=${page}` : ""
      }`,
    );
    people.push(...(body.data ?? []));
    page = body.meta?.next_token ?? "";
    console.log(`@${handle}: ${people.length} accounts`);
  } while (page);
  return people.map((p) => ({
    xUserId: p.id,
    handle: p.username,
    name: p.name,
    followers: p.public_metrics?.followers_count ?? 0,
  }));
}

// RFC 4180 rows: quoted fields may hold commas, "" and line breaks.
function csvRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') field += text[i++];
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") (row.push(field), (field = ""));
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      (row.push(field), rows.push(row), (row = []), (field = ""));
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

// A file is this script's own --out JSON, a CSV with Name and Handle columns,
// or plain handles one per line.
async function load(path) {
  const text = await readFile(path, "utf8");
  if (path.endsWith(".csv")) {
    const [header = [], ...rows] = csvRows(text);
    const column = (name) =>
      header.findIndex((h) => h.trim().toLowerCase() === name);
    const [nameAt, handleAt] = [column("name"), column("handle")];
    if (handleAt < 0) throw new Error("The CSV needs a Handle column.");
    const parsed = rows
      .filter((row) => row.some((cell) => cell.trim()))
      .map((row) => ({
        handle: (row[handleAt] ?? "").trim().replace(/^@+/, ""),
        name: nameAt < 0 ? "" : (row[nameAt] ?? "").trim(),
      }));
    const skipped = parsed.filter((e) => !HANDLE.test(e.handle));
    if (skipped.length)
      console.log(
        `skipped ${skipped.length} rows without a valid handle: ${skipped
          .slice(0, 5)
          .map((e) => JSON.stringify(e.name || e.handle))
          .join(", ")}`,
      );
    return parsed;
  }
  if (!path.endsWith(".txt")) return JSON.parse(text);
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^@+/, ""))
    .filter(Boolean)
    .map((handle) => ({ handle, name: "" }));
}

const fetched = file
  ? await load(file)
  : (await Promise.all(from.map(following))).flat();

// Lowercase "@handle" like the rest of Here For, one row per account.
// Files written by --out already carry the "@", so strip it before checking.
const bare = (e) =>
  typeof e.handle === "string" ? e.handle.replace(/^@+/, "") : "";
const entries = [
  ...new Map(
    fetched
      .filter((e) => HANDLE.test(bare(e)))
      .map((e) => [
        `@${bare(e).toLowerCase()}`,
        {
          handle: `@${bare(e).toLowerCase()}`,
          xUserId: e.xUserId ? String(e.xUserId) : null,
          // Strip control characters; names are shown as typed on X.
          name: String(e.name ?? "")
            // eslint-disable-next-line no-control-regex
            .replace(/[\u0000-\u001f\u007f]/g, "")
            .slice(0, 64),
          followers: Number.isSafeInteger(e.followers) ? e.followers : 0,
        },
      ]),
  ).values(),
];

if (out) {
  await writeFile(out, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`wrote ${entries.length} accounts to ${out}`);
} else {
  const db = new PrismaClient();
  try {
    if (args.includes("--reset")) await db.hereForDirectoryEntry.deleteMany();
    for (let i = 0; i < entries.length; i += 500) {
      const chunk = entries.slice(i, i + 500);
      const ids = chunk.flatMap((e) => (e.xUserId ? [e.xUserId] : []));
      await db.$transaction([
        // An account that changed its handle keeps its id: drop the old row.
        db.hereForDirectoryEntry.deleteMany({
          where: {
            xUserId: { in: ids },
            handle: { notIn: chunk.map((e) => e.handle) },
          },
        }),
        ...chunk.map(({ handle, ...entry }) =>
          db.hereForDirectoryEntry.upsert({
            where: { handle },
            create: { handle, ...entry },
            update: entry,
          }),
        ),
      ]);
    }
    console.log(`saved ${entries.length} accounts`);
  } finally {
    await db.$disconnect();
  }
}
