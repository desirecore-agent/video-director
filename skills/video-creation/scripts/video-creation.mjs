#!/usr/bin/env node
/** 定位已安装的视频创作并调用其领域 CLI；不经 shell，也不下载软件。 */
import { existsSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

const agentRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

export function parseArguments(args) {
  let appRoot;
  const forwarded = [];
  let locate = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--') {
      forwarded.push(...args.slice(index + 1));
      break;
    } else if (args[index] === '--app-root') {
      if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error('--app-root requires a directory.');
      appRoot = args[++index];
    } else if (args[index] === '--locate') {
      locate = true;
    } else {
      forwarded.push(args[index]);
    }
  }
  return { appRoot, locate, forwarded };
}

export function locateApplication({ appRoot, env = process.env, cwd = process.cwd(), contentRoot = agentRoot } = {}) {
  const configured = appRoot || env.VIDEO_CREATION_ROOT;
  const candidates = configured
    ? [isAbsolute(configured) ? configured : resolve(cwd, configured)]
    : [cwd, resolve(contentRoot, '../video-creation')];
  for (const candidate of candidates) {
    const cli = resolve(candidate, 'desirecore/cli.mjs');
    if (existsSync(cli)) return { appRoot: realpathSync(candidate), cli: realpathSync(cli) };
  }
  throw new Error(configured
    ? `The configured video-creation app has no desirecore/cli.mjs: ${configured}`
    : 'Cannot locate the installed video-creation app. Set VIDEO_CREATION_ROOT or pass --app-root <directory>. No software was downloaded.');
}

export async function main(args = process.argv.slice(2)) {
  const { appRoot, locate, forwarded } = parseArguments(args);
  const application = locateApplication({ appRoot });
  if (locate) {
    process.stdout.write(`${JSON.stringify(application)}\n`);
    return 0;
  }
  const child = spawn(process.execPath, [application.cli, ...forwarded], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    shell: false,
  });
  const forwardInterrupt = () => child.kill('SIGINT');
  const forwardTerminate = () => child.kill('SIGTERM');
  process.once('SIGINT', forwardInterrupt);
  process.once('SIGTERM', forwardTerminate);
  try {
    return await new Promise((resolveResult, reject) => {
      child.once('error', reject);
      child.once('exit', (code, signal) => resolveResult(code ?? (signal === 'SIGINT' ? 130 : 143)));
    });
  } finally {
    process.removeListener('SIGINT', forwardInterrupt);
    process.removeListener('SIGTERM', forwardTerminate);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().then((code) => { process.exitCode = code; }).catch((error) => {
    process.stderr.write(`video-director: ${error.message}\n`);
    process.exitCode = 1;
  });
}
