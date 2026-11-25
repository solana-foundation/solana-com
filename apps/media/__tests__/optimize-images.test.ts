import { execFile } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const optimizer = fileURLToPath(
  new URL("../scripts/optimize-images.mjs", import.meta.url),
);

it("updates Markdown escaped image URLs when optimizing an upload", async () => {
  const directory = await realpath(
    await mkdtemp(path.join(tmpdir(), "media-images-")),
  );

  try {
    const contentDirectory = path.join(directory, "content", "posts");
    const imageDirectory = path.join(directory, "public", "uploads", "posts");
    await mkdir(contentDirectory, { recursive: true });
    await mkdir(imageDirectory, { recursive: true });

    const imagePath = path.join(imageDirectory, "Speaker All-Up (fixed).jpg");
    const postPath = path.join(contentDirectory, "post.mdx");
    await sharp({
      create: {
        width: 4,
        height: 4,
        channels: 3,
        background: "white",
      },
    })
      .jpeg()
      .toFile(imagePath);
    await writeFile(
      postPath,
      "![](/uploads/posts/Speaker%20All-Up%20\\(fixed\\).jpg)\n",
    );

    await execFileAsync(process.execPath, [optimizer, imagePath], {
      cwd: directory,
      env: { ...process.env, INIT_CWD: directory },
    });

    expect(await readFile(postPath, "utf8")).toBe(
      "![](/uploads/posts/Speaker%20All-Up%20\\(fixed\\).webp)\n",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
