#!/usr/bin/env node
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { checkContent } from './content-check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--desirecore-root') throw new Error('Usage: node scripts/validate.mjs --desirecore-root <DesireCore source checkout>');
  const platformRoot = resolve(args[1]);
  const result = checkContent(root);
  if (result.errors.length) throw new Error(result.errors.join('\n'));
  const platformRequire = createRequire(resolve(platformRoot, 'package.json'));
  const tsx = platformRequire.resolve('tsx');
  const validation = spawnSync(process.execPath, ['--import', tsx, resolve(root, 'scripts/validate-schema.mjs'), platformRoot, root], {
    cwd: platformRoot,
    env: { ...process.env, TSX_TSCONFIG_PATH: resolve(platformRoot, 'tsconfig.json') },
    stdio: 'inherit',
    shell: false,
  });
  if (validation.error) throw validation.error;
  if (validation.status !== 0) process.exitCode = validation.status ?? 1;
  else console.log(`Content: ${result.skills} skills, prompt layers, local references and provenance passed.`);
} catch (error) {
  console.error(`video-director validation: ${error.message}`);
  process.exitCode = 1;
}
