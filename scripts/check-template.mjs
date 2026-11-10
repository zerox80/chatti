import {readFileSync, readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const hosting = JSON.parse(readFileSync(path.join(root, ".openai/hosting.json"), "utf8"));
if ("project_id" in hosting) throw Error("Die öffentliche Vorlage darf keine persönliche project_id enthalten.");
if (hosting.d1 !== "DB" || hosting.r2 !== null || !hosting.capabilities?.includes("mcp"))
  throw Error("Die Vorlage benötigt D1 DB und die MCP-Capability.");

const skip = new Set([".git", "node_modules", "dist", ".next", ".vinext", ".wrangler", ".sites-runtime", "outputs", "work"]);
const personal = /appg(?:prj|ver|dep)_[a-f0-9]{16,}|plugin_asdk_app_sites_[a-f0-9]{16,}|https?:\/\/[a-z0-9.-]+\.chatgpt\.site\b/i;
const failures = [];
function walk(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (skip.has(entry.name) || entry.isSymbolicLink()) continue;
    const full = path.join(directory, entry.name);
    const relative = path.relative(root, full);
    if (entry.isDirectory()) walk(full);
    else if (/^\.env|^\.dev\.vars|\.(?:pem|sqlite|sqlite3|db|zip|tar|gz)$/i.test(entry.name)) failures.push(relative);
    else if (personal.test(readFileSync(full, "utf8"))) failures.push(relative);
  }
}
walk(root);
if (failures.length) throw Error("Persönliche Identität oder Laufzeitdaten gefunden: " + failures.join(", "));
console.log("Sites-Vorlage geprüft: D1 + MCP, ohne persönliche Site-Identität oder Laufzeitdaten.");
