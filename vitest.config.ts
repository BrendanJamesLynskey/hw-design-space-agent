import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@content": path.resolve(__dirname, "./content"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    testTimeout: 60_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/lib/**/*.ts"],
      exclude: [
        // runs in a browser worker; its function (accuracy) is tested directly
        "src/lib/dse/accuracy.worker.ts",
        // the MDX component map (React components only)
        "src/lib/mdx/components.ts",
      ],
      thresholds: {
        // the TS ports, the animation states, the captions and the quoted values
        "src/lib/dse/**": {
          lines: 100,
          functions: 100,
          statements: 100,
          branches: 90,
        },
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
