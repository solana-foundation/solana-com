const purgePluginCreator = require("@fullhuman/postcss-purgecss");

// This is a wrapper around the purgecss plugin that allows you to ignore certain CSS files with the `ignore` option.
module.exports = (opts = {}) => {
  const { ignore, ...rest } = opts;
  const purgePlugin = purgePluginCreator(rest);
  const originalOnceExit = purgePlugin.OnceExit;
  purgePlugin.OnceExit = function (...args) {
    const [root] = args;
    const filename = root?.source?.input?.file;
    if (ignore && ignore.test(filename)) {
      // console.log("ignoring", filename);
      return;
    }
    // console.log("purging", filename);
    return originalOnceExit.apply(purgePlugin, arguments);
  };
  return purgePlugin;
};
module.exports.postcss = true;
