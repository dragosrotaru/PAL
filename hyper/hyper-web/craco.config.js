const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: {
    plugins: {
      add: [new MonacoWebpackPlugin({ template: "public/index.html" })],
    },
  },
};
