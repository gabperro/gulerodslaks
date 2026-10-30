const fs = require("node:fs");
const { createHash } = require("node:crypto");
const matter = require("gray-matter");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addWatchTarget("./css/style.css");
  eleventyConfig.addTransform("version-stylesheet", function(content) {
    if (typeof this.page.outputPath !== "string" || !this.page.outputPath.endsWith(".html")) return content;
    const version = createHash("sha256")
      .update(fs.readFileSync("css/style.css"))
      .digest("hex").slice(0, 12);
    return content.replace(
      /(\bhref=["'])(\/?css\/style\.css)(?:\?[^"']*)?(["'])/g,
      (_, prefix, path, quote) => `${prefix}${path}?v=${version}${quote}`
    );
  });
  eleventyConfig.addWatchTarget("./content/ideas/ideas.md");
  eleventyConfig.addGlobalData("ideaCards", () => {
    const source = fs.readFileSync("content/ideas/ideas.md", "utf8");
    const cards = matter(source).data.ideas;
    if (!Array.isArray(cards)) {
      throw new Error("Ideas data is missing. Keep all cards inside the opening and closing --- lines in content/ideas/ideas.md.");
    }
    return cards;
  });
};
