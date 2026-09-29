function quote(file) {
  return JSON.stringify(file);
}

function buildOxlintCommand(files) {
  return [`oxlint --fix ${files.map(quote).join(" ")}`];
}

function buildOxfmtCommand(files) {
  if (files.length === 0) {
    return [];
  }

  return [
    `oxfmt --no-error-on-unmatched-pattern ${files.map(quote).join(" ")}`,
  ];
}

function buildMediaImageCheckCommand(files) {
  if (files.length === 0) {
    return [];
  }

  return [
    `pnpm --filter solana-com-media exec node scripts/check-images.mjs ${files
      .map(quote)
      .join(" ")}`,
  ];
}

export default {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": (files) => [
    ...buildOxlintCommand(files),
    ...buildOxfmtCommand(files),
  ],
  "*.{md,mdx,json,scss,yml,yaml}": buildOxfmtCommand,
  "apps/media/content/**/*.{png,jpg,jpeg,webp,avif}":
    buildMediaImageCheckCommand,
  "apps/media/public/uploads/posts/**/*.{png,jpg,jpeg,webp,avif}":
    buildMediaImageCheckCommand,
};
