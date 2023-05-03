const { defineConfig } = require("cypress");

module.exports = defineConfig({
  pluginsFile: "tests/e2e/plugins/index.js",
  testFiles: "**/*.feature",
  BaseUrl: "http://localhost:3001",
  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
});
