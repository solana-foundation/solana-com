import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Diagrams live in apps/docs/public/docs-assets.
const publicRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../apps/docs/public/docs-assets/assets/docs",
);
const overviewRoot = path.join(publicRoot, "diagrams");
const coreRoot = path.join(publicRoot, "core");
const koraPath = path.join(publicRoot, "tools", "kora", "kora.svg");

const overviewLightPalette = {
  "#11131a": "#172033",
  "#9945ff": "#7c3aed",
  "#8490a3": "#667085",
  "#4b5565": "#5b6678",
  "#21d4fd": "#0284c7",
  "#14f195": "#059669",
  "#18d9ba": "#0f8b78",
  "#7257f6": "#6d5bd0",
  "#7b2cf5": "#7c3aed",
  "#079ec4": "#0284c7",
  "#059f67": "#059669",
  "#f7f8fb": "#f8fafc",
  "#b4bac7": "#94a3b8",
  "#8752f3": "#6d5bd0",
  "#687386": "#667085",
  "#5b6fd8": "#4f63c8",
  "#5497d5": "#3b82b6",
  "#43b4ca": "#159db2",
  "#3174d9": "#2563eb",
  "#28e0b9": "#0ea982",
  "#21a9d1": "#0284c7",
  "#19fb9b": "#059669",
  "#08a985": "#0f8b78",
  "#009d7b": "#0f8b78",
};

const legacyLightPalette = {
  "#ffffff": "#ffffff",
  "#f2f5f7": "#f8fafc",
  "#e3e8ed": "#eef2f7",
  "#ced8e0": "#d5dce5",
  "#c3cfd9": "#c9d2de",
  "#9eadba": "#9aa8b8",
  "#788896": "#6b778c",
  "#293845": "#172033",
  "#444444": "#344054",
  "#e0defd": "#ede9fe",
  "#6558f5": "#7c3aed",
  "#f2d6f6": "#fae8ff",
  "#bd34d1": "#a21caf",
  "#e3cff3": "#f3e8ff",
  "#730fc3": "#7e22ce",
  "#d5e7f7": "#e8f2ff",
  "#2c88d9": "#2563eb",
  "#d1efec": "#e6f7f2",
  "#1aae9f": "#0f8b78",
  "#fdf3d3": "#fff7dd",
  "#f7c325": "#b88400",
  "#fae6d8": "#fff0e6",
  "#e8833a": "#c45a18",
};

// Solana palette for every light diagram (zinc neutrals, Solana purple,
// green, and teal). Applied after the normalizers above, so it also restyles
// diagrams that were converted earlier. Targets are never keys of the
// palettes above, which keeps the script idempotent.
const solanaLightPalette = {
  "#172033": "#18181b",
  "#344054": "#3f3f46",
  "#444444": "#3f3f46",
  "#444": "#3f3f46",
  "#5b6678": "#52525b",
  "#667085": "#71717a",
  "#6b778c": "#71717a",
  "#94a3b8": "#a1a1aa",
  "#98a2b3": "#a1a1aa",
  "#9aa8b8": "#a1a1aa",
  "#c9d2de": "#d4d4d8",
  "#d5dce5": "#e4e4e7",
  "#eef2f7": "#f4f4f5",
  "#f8fafc": "#fafafa",
  "#a21caf": "#9b4dff",
  "#7e22ce": "#7f5cf0",
  "#6d5bd0": "#7f5cf0",
  "#4f63c8": "#7f5cf0",
  "#fae8ff": "#f3edff",
  "#ede9fe": "#f3edff",
  "#f3e8ff": "#f3edff",
  "#f3f0ff": "#f3edff",
  "#d7d0f5": "#e3d8fb",
  "#0284c7": "#3b82f6",
  "#2563eb": "#3b82f6",
  "#3b82b6": "#3b82f6",
  "#0369a1": "#2f6fe0",
  "#e8f2ff": "#eff6ff",
  "#f0f9ff": "#eff6ff",
  "#059669": "#0a8f5a",
  "#047857": "#0a7a4c",
  "#0ea982": "#0bb070",
  "#0f8b78": "#0f9e94",
  "#159db2": "#0f9e94",
  "#e6f7f2": "#e3fbef",
  "#ecfdf5": "#e3fbef",
};

// Dark pairs are generated from the light files: same layout, page-coloured
// canvas (#0a0a0b, the docs dark background), brighter accents.
const darkPalette = {
  "#ffffff": "#0a0a0b",
  "#fafafa": "#111113",
  "#f4f4f5": "#18181b",
  "#e4e4e7": "#27272a",
  "#d4d4d8": "#3f3f46",
  "#a1a1aa": "#71717a",
  "#71717a": "#a1a1aa",
  "#52525b": "#a1a1aa",
  "#3f3f46": "#d4d4d8",
  "#18181b": "#f2f2f3",
  "#7c3aed": "#a777ff",
  "#7a2fe0": "#b78aff", // the system accent (brand-diagrams.mjs)
  "#9b4dff": "#b98bff",
  "#7f5cf0": "#9b84f5",
  "#f3edff": "#1c1430",
  "#e3d8fb": "#4c3a75",
  "#3b82f6": "#60a5fa",
  "#2f6fe0": "#60a5fa",
  "#eff6ff": "#0f1a2e",
  "#0a8f5a": "#14f195",
  "#0a7a4c": "#14f195",
  "#0bb070": "#14f195",
  "#0f9e94": "#19d3c5",
  "#e3fbef": "#0b261b",
  "#b45309": "#fbbf24",
  "#fff7dd": "#342c16",
  "#b88400": "#facc15",
  "#fff0e6": "#352317",
  "#c45a18": "#fb923c",
  "#9a7700": "#facc15",
  "#fff7d6": "#342c16",
  "#552222": "#fca5a5",
};

/** Single pass, so one mapping's output is never re-mapped by another. */
function replacePalette(svg, palette) {
  const lower = Object.fromEntries(
    Object.entries(palette).map(([k, v]) => [k.toLowerCase(), v]),
  );
  const keys = Object.keys(lower).sort((x, y) => y.length - x.length);
  const re = new RegExp(`(${keys.join("|")})(?![0-9a-f])`, "gi");
  return svg.replace(re, (m) => lower[m.toLowerCase()]);
}

function normalizeOverview(svg) {
  return replacePalette(svg, overviewLightPalette)
    .replaceAll(/#fff(?=[\s;"'])/gi, "#ffffff")
    .replaceAll('fill="#ffffff" stroke=', 'fill="none" stroke=')
    .replaceAll(".node{fill:#ffffff;", ".node{fill:none;")
    .replaceAll(
      "Diatype,Helvetica,sans-serif",
      "Diatype,Inter,ui-sans-serif,system-ui,sans-serif",
    )
    .replaceAll('rx="82"', 'rx="36"')
    .replaceAll('rx="18"', 'rx="16"')
    .replaceAll('rx="16"', 'rx="14"')
    .replaceAll('rx="14"', 'rx="12"')
    .replaceAll('filter="url(#network-glow)"', "");
}

function normalizeLegacy(svg) {
  return replacePalette(
    svg
      .replace(
        /<style>@font-face\{[\s\S]*?<\/style>/,
        "<style>text{font-family:Diatype,Inter,ui-sans-serif,system-ui,sans-serif}</style>",
      )
      .replaceAll(
        "DIN Next, system-ui, sans-serif",
        "Diatype,Inter,ui-sans-serif,system-ui,sans-serif",
      )
      .replaceAll("PFDINMonoPro", "ui-monospace,monospace")
      .replaceAll('rx="3"', 'rx="8"')
      .replaceAll('ry="3"', 'ry="8"'),
    legacyLightPalette,
  );
}

function normalizeKora(svg) {
  return svg
    .replaceAll("Arial", "Diatype,Inter,ui-sans-serif,system-ui,sans-serif")
    .replaceAll(
      "hsl(259.6261682243, 59.7765363128%, 87.9019607843%)",
      "#d7d0f5",
    )
    .replaceAll("#eaeaea", "#f8fafc")
    .replaceAll("#ECECFF", "#f3f0ff")
    .replaceAll("#f4f4f4", "#f8fafc")
    .replaceAll("#fff5ad", "#fff7d6")
    .replaceAll("#aaaa33", "#9a7700")
    .replaceAll("#999", "#98a2b3")
    .replaceAll("#666", "#667085")
    .replaceAll("#333333", "#344054")
    .replaceAll("#333", "#344054")
    .replaceAll("black", "#172033")
    .replaceAll("white", "#ffffff")
    .replaceAll('rx="3"', 'rx="8"')
    .replaceAll('ry="3"', 'ry="8"');
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function listSvgFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? listSvgFiles(file) : [file];
    }),
  );
  return files.flat().filter((file) => file.endsWith(".svg"));
}

async function createLightSource(source, normalize) {
  const light = source.replace(/\.svg$/, "-light.svg");
  if (!(await exists(light))) {
    await writeFile(light, normalize(await readFile(source, "utf8")));
  }
  return light;
}

async function writeDarkPair(light) {
  const dark = light.replace(/-light\.svg$/, ".svg");
  const source = await readFile(light, "utf8");
  await writeFile(dark, replacePalette(source, darkPalette));
}

// Figures drawn by draw-concepts.mjs carry data-sol-drawn="hand" and are
// written in both modes by that script: never normalize or re-pair them.
const handDrawn = async (file) =>
  /<svg\b[^>]*data-sol-drawn="hand"/.test(await readFile(file, "utf8"));
async function notHandDrawn(files) {
  const keep = await Promise.all(files.map(async (f) => !(await handDrawn(f))));
  return files.filter((_, i) => keep[i]);
}

const overviewLights = await notHandDrawn(
  (await listSvgFiles(overviewRoot)).filter((file) =>
    file.endsWith("-light.svg"),
  ),
);
for (const light of overviewLights) {
  await writeFile(light, normalizeOverview(await readFile(light, "utf8")));
}

const coreSources = await notHandDrawn(
  (await listSvgFiles(coreRoot)).filter((file) => !file.endsWith("-light.svg")),
);
const coreLights = await Promise.all(
  coreSources.map((source) => createLightSource(source, normalizeLegacy)),
);
const koraLight = await createLightSource(koraPath, normalizeKora);

// The frontend, finance and Kora request-lifecycle pairs are drawn by hand
// in both modes and are left alone.
const generatedLights = [...overviewLights, ...coreLights, koraLight];
for (const light of generatedLights) {
  const svg = await readFile(light, "utf8");
  const restyled = replacePalette(svg, solanaLightPalette);
  if (restyled !== svg) await writeFile(light, restyled);
}
for (const light of generatedLights) {
  await writeDarkPair(light);
}
