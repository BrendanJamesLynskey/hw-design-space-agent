/**
 * Lighthouse CI's server: `next start`, then one request to every audited page before it says
 * it is ready, so the first audited URL is not also the server's cold start (03B saw one cold
 * run of "/" at 0.69 performance). Prints "Warm and ready" for lighthouserc.json's
 * startServerReadyPattern.
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const urls = JSON.parse(readFileSync("lighthouserc.json", "utf-8")).ci.collect
  .url;
const next = spawn("pnpm", ["start", "-p", "3000"], {
  stdio: ["ignore", "pipe", "inherit"],
});
let warmed = false;
next.stdout.on("data", async (buf) => {
  process.stdout.write(buf);
  if (warmed || !/Ready/.test(String(buf))) return;
  warmed = true;
  for (const u of urls) await fetch(u).then((r) => r.text());
  console.log("Warm and ready");
});
for (const sig of ["SIGINT", "SIGTERM"])
  process.on(sig, () => {
    next.kill(sig);
    process.exit(0);
  });
