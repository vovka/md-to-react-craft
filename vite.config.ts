import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createSiteFilesPlugin } from "./build/siteFiles";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://blog.shcherbyna.me").replace(/\/$/, "");
  const indexable = env.VITE_ROBOTS_INDEX === "true";
  const siteFiles = createSiteFilesPlugin({
    siteUrl,
    indexable,
    postDirectory: path.resolve(__dirname, "src/content/posts"),
  });

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), siteFiles, mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
