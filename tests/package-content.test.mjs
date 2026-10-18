import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { checkContent } from '../scripts/content-check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('distributed Agent has valid prompt layers, skills, references and provenance', () => {
  const result = checkContent(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.skills, 11);
});

test('package validation rejects a stale skill reference and hardcoded Provider', (t) => {
  const copy = mkdtempSync(resolve(tmpdir(), 'video-director-content-'));
  t.after(() => rmSync(copy, { recursive: true, force: true }));
  cpSync(root, copy, { recursive: true, filter: (source) => !source.split('/').includes('.git') });
  const path = resolve(copy, 'agent.json');
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.default_enabled.skills.push('missing-skill');
  config.llm.providerId = 'some-provider';
  writeFileSync(path, JSON.stringify(config));
  const result = checkContent(copy);
  assert(result.errors.some((error) => error.includes('Missing skill: missing-skill')));
  assert(result.errors.some((error) => error.includes('llm.providerId')));
});
