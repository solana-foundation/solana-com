/**
 * Restores the published `@solana/web3.js` specifier in transcluded examples.
 *
 * `packages/docs-examples` installs both web3.js majors side by side, which pnpm
 * only allows under distinct names: `@solana/web3.js-v3` and
 * `@solana/web3.js-legacy`. Readers install neither of those, so the aliases are
 * rewritten back to the real package name once the code has been inlined.
 *
 * Must run AFTER `@devrelkit/remark-include-code`, which is what puts the
 * example source into the fence.
 */
const remarkWeb3jsSpecifier = () => (tree) => {
  eachCodeNode(tree, (node) => {
    if (typeof node.value !== "string") return;
    node.value = node.value.replace(ALIAS_RE, "@solana/web3.js");
  });
};

const ALIAS_RE = /@solana\/web3\.js-(?:v3|legacy)/g;

function eachCodeNode(node, visitor) {
  if (node.type === "code") {
    visitor(node);
    return;
  }
  for (const child of node.children ?? []) {
    eachCodeNode(child, visitor);
  }
}

export default remarkWeb3jsSpecifier;
