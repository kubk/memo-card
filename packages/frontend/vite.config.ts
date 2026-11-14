import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";
import { execSync } from "node:child_process";
import { availableParallelism } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import mobxReactPlugin from "mobx-react-plugin/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The playground is built on its own, because the modules it shares with the app would split the app into more,
// smaller chunks, which compress worse
const isPlaygroundBuild = process.env.BUILD_PLAYGROUND === "1";

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
    tailwindcss(),
    preact(),
    mobxReactPlugin({
      exclude: ["src/ui/shadcn/**"],
      // No React Compiler here, so the "use no memo" directives are not needed
      observer: { useNoMemo: false },
    }),
  ],
  test: {
    // The default of one fewer worker than CPUs leaves 2-CPU CI runners with a single worker
    maxWorkers: availableParallelism(),
    // tsconfig.json only references other configs, so it gives the checker no files
    typecheck: { checker: "tsrs", tsconfig: "./tsconfig.app.json" },
    alias: {
      "mobx-react-lite": resolve(
        __dirname,
        "../../node_modules/mobx-react-lite/dist/mobxreactlite.mjs",
      ),
    },
    server: {
      deps: {
        inline: [/mobx-react-lite/],
      },
    },
  },
  define: {
    __LAST_COMMIT__: JSON.stringify(getLastCommit()),
  },
  build: {
    sourcemap: true,
    emptyOutDir: !isPlaygroundBuild,
    rollupOptions: {
      input: isPlaygroundBuild
        ? { playground: resolve(__dirname, "playground/index.html") }
        : { main: resolve(__dirname, "index.html") },
      output: {
        // Libraries, main.tsx with what it imports, and app.tsx with what it imports each get one chunk. Large
        // chunks compress better than the small shared chunks automatic splitting makes. The priorities keep
        // code main.tsx imports out of the app chunk, which main.tsx still loads with import()
        codeSplitting: {
          groups: [
            { name: "vendor", test: /[\\/]node_modules[\\/]/, priority: 2 },
            { name: "main", tags: ["$initial"], priority: 1 },
            { name: "app", test: /[\\/]src[\\/]screens[\\/]app\.tsx$/ },
          ],
        },
      },
    },
  },
  server: {
    port: 5180,
    // Orb portals block cross-origin API calls, so the local API is also served from /api
    proxy: {
      "/api": {
        target: "http://localhost:8780",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
