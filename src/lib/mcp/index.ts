import { defineMcp } from "@lovable.dev/mcp-js";
import listPostsTool from "./tools/list-posts";
import getPostTool from "./tools/get-post";
import searchPostsTool from "./tools/search-posts";

export default defineMcp({
  name: "shcherbyna-blog-mcp",
  title: "Volodymyr Shcherbyna's Blog",
  version: "0.1.0",
  instructions:
    "Public read-only tools for Volodymyr Shcherbyna's blog (blog.shcherbyna.me). Use `list_posts` to browse posts, `search_posts` to search across titles/content/tags, and `get_post` to fetch full markdown content of a single post by slug.",
  tools: [listPostsTool, getPostTool, searchPostsTool],
});
