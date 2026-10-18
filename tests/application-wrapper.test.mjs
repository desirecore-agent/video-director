import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { locateApplication, parseArguments } from '../skills/video-creation/scripts/video-creation.mjs';

const wrapper = fileURLToPath(new URL('../skills/video-creation/scripts/video-creation.mjs', import.meta.url));
function fixture(t) {
  const root = realpathSync(mkdtempSync(resolve(tmpdir(), 'video-director app ')));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const app = resolve(root, 'video-creation');
  mkdirSync(resolve(app, 'desirecore'), { recursive: true });
  writeFileSync(resolve(app, 'desirecore/cli.mjs'), 'console.log(JSON.stringify({args:process.argv.slice(2),cwd:process.cwd()})); process.exitCode = process.argv.includes("--fail") ? 7 : process.argv.includes("--conflict") ? 3 : 0;');
  return { root, app };
}

test('explicit app root takes precedence over an environment value', (t) => {
  const { root, app } = fixture(t);
  assert.equal(locateApplication({ appRoot: app, env: { VIDEO_CREATION_ROOT: '/not-installed' }, cwd: root }).appRoot, app);
});

test('an invalid explicit installation never falls back to a different app', (t) => {
  const { root, app } = fixture(t);
  assert.throws(() => locateApplication({ appRoot: 'missing', env: { VIDEO_CREATION_ROOT: app }, cwd: root, contentRoot: resolve(root, 'video-director') }), /configured video-creation app/);
});

test('environment and adjacent source checkout discovery are supported', (t) => {
  const { root, app } = fixture(t);
  assert.equal(locateApplication({ env: { VIDEO_CREATION_ROOT: 'video-creation' }, cwd: root }).appRoot, app);
  assert.equal(locateApplication({ env: {}, cwd: root, contentRoot: resolve(root, 'video-director') }).appRoot, app);
});

test('missing app returns a useful error and performs no download', (t) => {
  const { root } = fixture(t);
  assert.throws(() => locateApplication({ env: {}, cwd: resolve(root, 'film'), contentRoot: resolve(root, 'isolated/video-director') }), /No software was downloaded/);
});

test('arguments containing spaces and shell syntax reach the CLI literally', (t) => {
  const { root, app } = fixture(t);
  const value = 'project name; $(touch never) `echo not-executed`';
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, 'inspect', value, '--home', 'a home'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { args: ['inspect', value, '--home', 'a home'], cwd: root });
});

test('CLI failure code propagates, and locate does not execute the CLI', (t) => {
  const { root, app } = fixture(t);
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, '--fail'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 7);
  const located = spawnSync(process.execPath, [wrapper, '--app-root', app, '--locate', '--fail'], { cwd: root, encoding: 'utf8' });
  assert.equal(located.status, 0, located.stderr);
  assert.equal(JSON.parse(located.stdout).cli, resolve(app, 'desirecore/cli.mjs'));
  assert.throws(() => parseArguments(['--app-root']), /requires a directory/);
});


test('动效参数文件和精确 revision 原样送达安装应用', (t) => {
  const { root, app } = fixture(t);
  const args = ['motion-patch', '项目 含空格', 'clip-标题', '--base', 'revision:不可改写', '--ops', '动效 changes.json', '--home', '隔离 home'];
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
});

test('完整导出参数不被包装器降级或改写', (t) => {
  const { root, app } = fixture(t);
  const args = ['render', '项目', '--codec', 'prores4444', '--alpha', '--fps', '30000/1001', '--quality', 'master', '--frame', '9:16', '--fill', 'contain', '--width', '1080', '--height', '1920', '--range', '0-3.5', '--clip', 'clip-a', '--scale', '1', '--samples', '8', '--shutter', '0.5', '--no-audio', '--no-hardware', '--burn-subtitles', '--sidecar', 'vtt', '--output', '透明 输出', '--wait', '--timeout', '120'];
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
});

test('应用锁冲突保留退出码且不会自动重试', (t) => {
  const { root, app } = fixture(t);
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, 'motion-patch', '项目', 'clip-a', '--conflict'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 3);
  assert.equal(result.stdout.trim().split('\n').length, 1);
});

test('双横线之后的开关交给领域 CLI，避免与定位选项冲突', (t) => {
  const { root, app } = fixture(t);
  const args = ['motion-inspect', '项目', '--locate', '--app-root', '领域值'];
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, '--', ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
});
