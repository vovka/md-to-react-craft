import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { githubPagesSpa } from "@sctg/vite-plugin-github-pages-spa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  return {
    server: {
      host: "::",
      port: 8080,
    },
    base: mode === "production" && repoName ? `/${repoName}/` : "/",
    plugins: [react(), mode === "development" && componentTagger(), mode === "production" && githubPagesSpa()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
