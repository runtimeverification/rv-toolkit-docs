const { cleanUpFiles, generatePagesFromMarkdownFiles } = require("k-web-theme");
const path = require("path");
const fs = require("fs");

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
  websiteOrigin: "https://runtimeverification.github.io/rv-toolkit-docs",
  template: pageTemplate,
  includeFileBasePath: path.resolve(__dirname, "./static_content/html"),
});

pageTemplate = fs
  .readFileSync(path.resolve(__dirname, "./static_content/html/match_page_template.html"))
  .toString("utf-8");
generatePagesFromMarkdownFiles({
  globPattern: path.resolve(__dirname, "../match") + "/**/*.md",
  globOptions: { ignore: [path.resolve(__dirname, "../web/**/*")] },
  origin: "https://github.com/runtimeverification/rv-toolkit-docs/tree/master/",
  sourceDirectory: path.resolve(__dirname, "../match/"),
  outputDirectory: path.resolve(__dirname, "./public_content/match/"),
  websiteDirectory: path.resolve(__dirname, "./public_content/"),
  websiteOrigin: "https://runtimeverification.github.io/rv-toolkit-docs",
  template: pageTemplate,
  includeFileBasePath: path.resolve(__dirname, "./static_content/html"),
});


pageTemplate = fs
  .readFileSync(path.resolve(__dirname, "./static_content/html/predict_java_page_template.html"))
  .toString("utf-8");
generatePagesFromMarkdownFiles({
  globPattern: path.resolve(__dirname, "../predict/java") + "/**/*.md",
  globOptions: { ignore: [path.resolve(__dirname, "../web/**/*")] },
  origin: "https://github.com/runtimeverification/rv-toolkit-docs/tree/master/",
  sourceDirectory: path.resolve(__dirname, "../predict/java/"),
  outputDirectory: path.resolve(__dirname, "./public_content/predict/java/"),
  websiteDirectory: path.resolve(__dirname, "./public_content/"),
  websiteOrigin: "https://runtimeverification.github.io/rv-toolkit-docs",
  template: pageTemplate,
  includeFileBasePath: path.resolve(__dirname, "./static_content/html"),
});

pageTemplate = fs
  .readFileSync(path.resolve(__dirname, "./static_content/html/predict_c_page_template.html"))
  .toString("utf-8");
generatePagesFromMarkdownFiles({
  globPattern: path.resolve(__dirname, "../predict/c") + "/**/*.md",
  globOptions: { ignore: [path.resolve(__dirname, "../web/**/*")] },
  origin: "https://github.com/runtimeverification/rv-toolkit-docs/tree/master/",
  sourceDirectory: path.resolve(__dirname, "../predict/c/"),
  outputDirectory: path.resolve(__dirname, "./public_content/predict/c/"),
  websiteDirectory: path.resolve(__dirname, "./public_content/"),
  websiteOrigin: "https://runtimeverification.github.io/rv-toolkit-docs",
  template: pageTemplate,
  includeFileBasePath: path.resolve(__dirname, "./static_content/html"),
});
