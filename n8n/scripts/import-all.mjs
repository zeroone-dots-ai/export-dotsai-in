#!/usr/bin/env node
/**
 * Import all workflows from n8n/workflows/*.json into the live n8n instance.
 *
 *   N8N_HOST=https://n8n.dotsai.cloud \
 *   N8N_API_KEY=eyJ... \
 *   node n8n/scripts/import-all.mjs [--update] [--activate]
 *
 * Behaviour:
 *   - Default: create-only. If a workflow with the same name already exists, skip.
 *   - --update: if a workflow with the same name exists, update it (PUT).
 *   - --activate: after upsert, activate the workflow.
 *
 * Tags `export-dotsai-in` are applied via the tag API (separate call — the
 * /workflows endpoints do not accept tags in the body).
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKFLOWS_DIR = resolve(__dirname, "..", "workflows");

const HOST = process.env.N8N_HOST?.replace(/\/$/, "");
const KEY = process.env.N8N_API_KEY;
if (!HOST || !KEY) {
  console.error("✗ Set N8N_HOST and N8N_API_KEY env vars.");
  process.exit(1);
}

const FLAGS = new Set(process.argv.slice(2));
const UPDATE = FLAGS.has("--update");
const ACTIVATE = FLAGS.has("--activate");

const headers = {
  "X-N8N-API-KEY": KEY,
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function api(method, path, body) {
  const res = await fetch(`${HOST}/api/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${json.message || text}`);
  return json;
}

async function listWorkflows() {
  const all = [];
  let cursor;
  do {
    const q = new URLSearchParams({ limit: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await api("GET", `/workflows?${q}`);
    all.push(...(page.data || []));
    cursor = page.nextCursor;
  } while (cursor);
  return all;
}

function clean(wf) {
  // n8n create/update accepts only: name, nodes, connections, settings
  const out = {};
  for (const k of ["name", "nodes", "connections", "settings"]) {
    if (wf[k] !== undefined) out[k] = wf[k];
  }
  return out;
}

const files = readdirSync(WORKFLOWS_DIR).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.log("No workflow JSON files found in", WORKFLOWS_DIR);
  process.exit(0);
}

console.log(`Found ${files.length} workflow file(s).`);
const existing = await listWorkflows();
const byName = new Map(existing.map((w) => [w.name, w]));

for (const file of files) {
  const path = join(WORKFLOWS_DIR, file);
  const wf = JSON.parse(readFileSync(path, "utf8"));
  const payload = clean(wf);
  const existing = byName.get(payload.name);

  try {
    let result;
    if (existing && UPDATE) {
      result = await api("PUT", `/workflows/${existing.id}`, payload);
      console.log(`  ↻ updated · ${payload.name} · id=${result.id}`);
    } else if (existing) {
      console.log(`  · skip (exists) · ${payload.name} · id=${existing.id} (pass --update to overwrite)`);
      continue;
    } else {
      result = await api("POST", `/workflows`, payload);
      console.log(`  ✓ created · ${payload.name} · id=${result.id}`);
    }

    if (ACTIVATE && result?.id) {
      await api("POST", `/workflows/${result.id}/activate`);
      console.log(`     ⚡ activated`);
    }
  } catch (err) {
    console.error(`  ✗ ${payload.name} → ${err.message}`);
  }
}

console.log("\nDone.");
