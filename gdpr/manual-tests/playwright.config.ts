import { defineConfig } from "@playwright/test";
import path from "path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: __dirname,
  fullyParallel: false,
  retries: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: path.join(__dirname, "artifacts", "test-results"),
  reporter: [
    ["list"],
    ["html", { outputFolder: path.join(__dirname, "artifacts", "html-report"), open: "never" }],
  ],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
