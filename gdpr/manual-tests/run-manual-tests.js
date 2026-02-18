#!/usr/bin/env node

const readline = require("readline");
const { spawn } = require("child_process");
const http = require("http");
const https = require("https");

const defaultBaseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

const workflows = [
  { key: "1", name: "Partner signup", grep: "@partner" },
  { key: "2", name: "Customer signup", grep: "@customer" },
  { key: "3", name: "Onboarding redirect", grep: "@redirect" },
  { key: "4", name: "Trial gating/paywall (placeholder)", grep: "@paywall" },
  { key: "5", name: "PDF generation (placeholder)", grep: "@pdf" },
  { key: "6", name: "Auth enforcement/sign-in (placeholder)", grep: "@auth|@signin" },
  { key: "7", name: "Run all", grep: null },
];

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function isReachable(url) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      resolve(false);
      return;
    }

    const lib = parsed.protocol === "https:" ? https : http;
    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname || "/",
        method: "GET",
        timeout: 5000,
      },
      (res) => {
        const ok = res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
        res.resume();
        resolve(Boolean(ok));
      }
    );

    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}

(async () => {
  const baseUrlAnswer = await prompt(`Base URL [${defaultBaseUrl}]: `);
  const baseUrl = baseUrlAnswer || defaultBaseUrl;

  const reachable = await isReachable(baseUrl);
  if (!reachable) {
    console.error(`Base URL is not reachable: ${baseUrl}`);
    process.exit(1);
  }

  console.log("\nSelect a workflow to run:");
  workflows.forEach((w) => console.log(`${w.key}. ${w.name}`));

  const choice = await prompt("Choice: ");
  const selected = workflows.find((w) => w.key === choice) || workflows[workflows.length - 1];

  const args = ["playwright", "test", "-c", "manual-tests/playwright.config.ts"];
  if (selected.grep) {
    args.push("--grep", selected.grep);
  }

  const child = spawn("npx", args, {
    stdio: "inherit",
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: baseUrl,
    },
  });

  child.on("exit", (code) => process.exit(code ?? 1));
})();
