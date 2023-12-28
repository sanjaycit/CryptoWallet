const path = require('path');
const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add polyfill configuration for crypto, stream, assert, path, and worker_threads
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
      path: require.resolve('path-browserify'),
      fs: false, // Set fs to false or require.resolve('fs') if you really need it
      worker_threads: false, // Disable worker_threads
    },
  };

  // Add extensions and plugins
  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};
