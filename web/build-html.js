const {
  cleanUpFiles,
  generatePagesFromMarkdownFiles,
  setHTMLBasePath,
} = require("k-web-theme");
const path = require("path");
const fs = require("fs");

cleanUpFiles(path.resolve(__dirname, "./public_content/"));

let pageTemplate = fs
  .readFileSync(
    path.resolve(__dirname, "./static_content/html/page_template.html")
  )
  .toString("utf-8");
generatePagesFromMarkdownFiles({
  globPattern: path.resolve(__dirname, "../") + "/README.md",
  globOptions: { ignore: [path.resolve(__dirname, "../web/**/*")] },
  origin: "https://github.com/runtimeverification/rv-toolkit-docs/tree/master/",
  sourceDirectory: path.resolve(__dirname, "../"),
  outputDirectory: path.resolve(__dirname, "./public_content/"),
  websiteDirectory: path.resolve(__dirname, "./public_content/"),
  template: pageTemplate,
});

pageTemplate = fs
  .readFileSync(path.resolve(__dirname, "../match/html/page_template.html"))
  .toString("utf-8");
setHTMLBasePath(path.resolve(__dirname, "../match/html/") + "/");
generatePagesFromMarkdownFiles({
  globPattern: path.resolve(__dirname, "../match") + "/**/*.md",
  globOptions: { ignore: [path.resolve(__dirname, "../web/**/*")] },
  origin: "https://github.com/runtimeverification/rv-toolkit-docs/tree/master/",
  sourceDirectory: path.resolve(__dirname, "../match/"),
  outputDirectory: path.resolve(__dirname, "./public_content/match/"),
  websiteDirectory: path.resolve(__dirname, "./public_content/"),
  template: pageTemplate,
});
