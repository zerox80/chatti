import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = name => readFileSync(new URL("../" + name, import.meta.url), "utf8");
const prompt = text => text.replace(/\r\n/g,"\n").split("```text", 2)[1].split("```", 1)[0].trim();

test("the standalone Codex prompt matches the README setup prompt", () => {
  assert.equal(prompt(read("README.md")), prompt(read("CODEX-START.md")));
});

test("the template and registered personal copy retain D1 + MCP", () => {
  const hosting = JSON.parse(read(".openai/hosting.json"));
  assert.equal(hosting.d1,"DB");
  assert.equal(hosting.r2,null);
  assert.ok(hosting.capabilities.includes("mcp"));
  assert.match(read("drizzle/0000_steep_the_fallen.sql"), /CREATE TABLE `libraries`/);
});
