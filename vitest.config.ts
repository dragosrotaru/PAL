import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/build/**",
      "**/lib/**",
      "**/out/**",
      "**/dist/**",
      "hyper-fs/**",
    ],
  },
});
