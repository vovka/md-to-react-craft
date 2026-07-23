import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { posts } from "../../posts";

export default defineTool({
  name: "get_post",
  title: "Get blog post",
  description:
    "Fetch the full markdown content and metadata of a single blog post by its slug. Use list_posts first if you don't know the slug.",
  inputSchema: {
    slug: z.string().min(1).describe("The post slug, e.g. 'local-mcp-bridge'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      return {
        content: [{ type: "text", text: `No post found with slug '${slug}'.` }],
        isError: true,
      };
    }
    const payload = {
      slug: post.slug,
      title: post.title,
      date: post.date,
      author: post.author,
      category: post.category,
      excerpt: post.excerpt,
      tags: post.tags,
      readingTime: post.readingTime,
      url: `https://blog.shcherbyna.me/${post.slug}`,
      content: post.content,
    };
    return {
      content: [{ type: "text", text: payload.content }],
      structuredContent: payload,
    };
  },
});
