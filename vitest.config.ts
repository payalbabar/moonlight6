import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    // compact-contract.test.ts requires the full Midnight WASM runtime (10+ MB)
    // and a live blockchain node — it's an integration/e2e test, not a unit test.
    // Exclude it from the standard unit test run to prevent OOM crashes.
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/__tests__/compact-contract.test.ts",
    ],
  },
});
