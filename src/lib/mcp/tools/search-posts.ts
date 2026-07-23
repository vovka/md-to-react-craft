import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { posts } from "../../posts";

export default defineTool({
  name: "search_posts",
  title: "Search blog posts",
  description:
    "Full-text search across blog post titles, excerpts, tags, and body content. Returns matching posts ranked by relevance with a short snippet.",
  inputSchema: {
    query: z.string().min(1).describe("Search phrase or keywords."),
    limit: z.number().int().positive().max(20).optional().describe("Max results (default 5)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const scored = posts
      .map((p) => {
        const title = p.title.toLowerCase();
        const excerpt = p.excerpt.toLowerCase();
        const tags = p.tags.join(" ").toLowerCase();
        const content = p.content.toLowerCase();
        let score = 0;
        if (title.includes(q)) score += 10;
        if (excerpt.includes(q)) score += 5;
        if (tags.includes(q)) score += 4;
        const contentHits = content.split(q).length - 1;
        score += contentHits;
        const idx = content.indexOf(q);
        const snippet =
          idx >= 0
            ? p.content.slice(Math.max(0, idx - 60), idx + q.length + 120).replace(/\s+/g, " ").trim()
            : p.excerpt;
        return { post: p, score, snippet };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit ?? 5)
      .map((r) => ({
        slug: r.post.slug,
        title: r.post.title,
        date: r.post.date,
        excerpt: r.post.excerpt,
        tags: r.post.tags,
        snippet: r.snippet,
        url: `https://blog.shcherbyna.me/${r.post.slug}`,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(scored, null, 2) }],
      structuredContent: { results: scored, total: scored.length },
    };
  },
});
