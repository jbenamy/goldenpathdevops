import { visit } from "unist-util-visit";

/**
 * Rehype plugin to add target="_blank" and rel="noopener noreferrer" to external links
 */
export default function rehypeExternalLinks() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a" && node.properties && node.properties.href) {
        const href = node.properties.href;

        // Check if link is external (starts with http:// or https://)
        if (typeof href === "string" && /^https?:\/\//.test(href)) {
          node.properties.target = "_blank";
          node.properties.rel = "noopener noreferrer";
        }
      }
    });
  };
}
