// split the content from the source/index.js file into separate files
// to avoid importing the whole thing
import chokidar from "chokidar";
import fs from "fs";

// if arg is "dev" keep watching for changes
const dev = process.argv[2] === "dev";

const collections = ["cookbook", "courses", "docs", "guides"];

export async function update() {
  let source;
  try {
    source = fs.readFileSync(".source/index.js", "utf8");
  } catch {
    return;
  }
  const lines = source.split(/\r?\n/);
  const contents = {
    cookbook: [lines[0]],
    courses: [lines[0]],
    docs: [lines[0]],
    guides: [lines[0]],
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    for (const collection of collections) {
      if (line.includes(collection)) {
        contents[collection].push(line);
      }
    }
  }

  await Promise.all(
    collections.map((collection) => {
      return fs.promises.writeFile(
        `./.source/${collection}.js`,
        contents[collection].join("\n"),
      );
    }),
  );

  await Promise.all(
    collections.map(async (collection) => {
      const ts = `./.source/${collection}.d.ts`;
      if (!fs.existsSync(ts)) {
        await fs.promises.writeFile(
          ts,
          `import type { GetOutput } from "fumadocs-mdx/config"
export declare const ${collection}: GetOutput<typeof import("../source.config.ts").${collection}>
export declare const ${collection}Meta: GetOutput<typeof import("../source.config.ts").${collection}Meta>`,
        );
      }
    }),
  );

  console.log("[MDX] collections updated");

  if (!dev) {
    process.exit(0);
  }
}

const watcher = chokidar.watch(".source", {
  persistent: true,
  awaitWriteFinish: true,
});

watcher.on("add", (path) => {
  if (path.endsWith("index.js")) {
    update();
  }
});

watcher.on("change", (path) => {
  if (path.endsWith("index.js")) {
    update();
  }
});

update();
