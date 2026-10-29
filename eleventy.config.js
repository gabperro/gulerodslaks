const fs = require("node:fs");
const matter = require("gray-matter");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
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
