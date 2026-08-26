import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const publicRoot = path.join(docsRoot, "public", "assets", "docs");
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

const darkPalette = {
  "#ffffff": "#0b1020",
  "#f8fafc": "#151d2e",
  "#eef2f7": "#1c2638",
  "#d5dce5": "#263247",
  "#c9d2de": "#3a485f",
  "#9aa8b8": "#64748b",
  "#94a3b8": "#64748b",
  "#6b778c": "#8492a6",
  "#667085": "#a8b3c2",
  "#5b6678": "#a8b3c2",
  "#172033": "#f8fafc",
  "#344054": "#e2e8f0",
  "#ede9fe": "#2b2045",
  "#7c3aed": "#a78bfa",
  "#fae8ff": "#321a3a",
  "#a21caf": "#e879f9",
  "#f3e8ff": "#2d1b42",
  "#7e22ce": "#c084fc",
  "#e8f2ff": "#152a44",
  "#2563eb": "#60a5fa",
  "#e6f7f2": "#12332e",
  "#0f8b78": "#2dd4bf",
  "#fff7dd": "#342c16",
  "#b88400": "#facc15",
  "#fff0e6": "#352317",
  "#c45a18": "#fb923c",
  "#0284c7": "#38bdf8",
  "#059669": "#34d399",
  "#6d5bd0": "#8b7cf6",
  "#4f63c8": "#7c8cf8",
  "#3b82b6": "#60a5fa",
  "#159db2": "#22d3ee",
  "#0ea982": "#2dd4bf",
  "#f3f0ff": "#2b2342",
  "#d7d0f5": "#594e7a",
  "#98a2b3": "#64748b",
  "#9a7700": "#facc15",
  "#fff7d6": "#342c16",
};

function replacePalette(svg, palette) {
  return Object.entries(palette).reduce(
    (result, [source, target]) =>
      result.replaceAll(new RegExp(source, "gi"), target),
    svg,
  );
}

function normalizeOverview(svg) {
  return replacePalette(svg, overviewLightPalette)
    .replaceAll(/#fff(?=[\s;"'])/gi, "#ffffff")
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

const overviewLights = (await listSvgFiles(overviewRoot)).filter((file) =>
  file.endsWith("-light.svg"),
);
for (const light of overviewLights) {
  await writeFile(light, normalizeOverview(await readFile(light, "utf8")));
}

const coreSources = (await listSvgFiles(coreRoot)).filter(
  (file) => !file.endsWith("-light.svg"),
);
const coreLights = await Promise.all(
  coreSources.map((source) => createLightSource(source, normalizeLegacy)),
);
const koraLight = await createLightSource(koraPath, normalizeKora);

for (const light of [...overviewLights, ...coreLights, koraLight]) {
  await writeDarkPair(light);
}
