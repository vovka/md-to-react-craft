import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { posts } from "../../posts";

export default defineTool({
  name: "list_posts",
  title: "List blog posts",
  description:
    "List all blog posts on Volodymyr Shcherbyna's blog with their slug, title, date, category, excerpt, and tags. Use this to discover posts before calling get_post.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Optional maximum number of posts to return (most recent first)."),
    tag: z
      .string()
      .optional()
      .describe("Optional case-insensitive tag filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit, tag }) => {
    const filtered = tag
      ? posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
      : posts;
    const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
    const items = (limit ? sorted.slice(0, limit) : sorted).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      author: p.author,
      category: p.category,
      excerpt: p.excerpt,
      tags: p.tags,
      readingTime: p.readingTime,
      url: `https://blog.shcherbyna.me/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { posts: items, total: items.length },
    };
  },
});
