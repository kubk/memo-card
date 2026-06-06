import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import observerPlugin from "mobx-react-observer/babel-plugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getLastCommit = () => {
  try {
    const [hash, name] = execSync("git log -1 --format=%H%n%s", {
      cwd: resolve(__dirname, "../.."),
      encoding: "utf8",
    })
      .trim()
      .split("\n");

    return { hash, name };
  } catch {
    return {
      hash: "unknown",
      name: "unknown",
    };
  }
};

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: [observerPlugin()],
    }),
  ],
  define: {
    __LAST_COMMIT__: JSON.stringify(getLastCommit()),
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin/index.html"),
      },
    },
  },
  server: {
    port: 5180,
  },
});
