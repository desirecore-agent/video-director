import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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

test('公开patch帮助与机器合同原样传递，不补项目或home参数', (t) => {
  const { root, app } = fixture(t);
  for (const args of [['patch', '--help'], ['patch', '--schema']]) {
    const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim().split('\n').length, 1);
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
  }
});

test('完整导出参数不被包装器降级或改写', (t) => {
  const { root, app } = fixture(t);
  const args = ['render', '项目', '--codec', 'prores4444', '--alpha', '--fps', '30000/1001', '--quality', 'master', '--frame', '9:16', '--fill', 'contain', '--width', '1080', '--height', '1920', '--range', '0-3.5', '--clip', 'clip-a', '--scale', '1', '--samples', '8', '--shutter', '0.5', '--no-audio', '--no-hardware', '--burn-subtitles', '--sidecar', 'vtt', '--output', '透明 输出', '--wait', '--timeout', '120'];
  const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
});

test('审片来源、已完成任务与时间点沿已安装CLI逐字传递，不隐式渲染', (t) => {
  const { root, app } = fixture(t);
  const examples = [
    ['review', '项目 含空格', '--source', 'current-project', '--times', '0,2.5', '--last', '--max-edge', '1280', '--home', '隔离 home'],
    ['review', '项目 含空格', '--source', 'export-job', '--job', '已完成-job-原版本', '--count', '4', '--last', '--max-edge', '1280', '--home', '隔离 home'],
  ];
  for (const args of examples) {
    const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim().split('\n').length, 1);
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
  }
});

test('P1公开审片合同与目标宽度首尾参数原样传递，不补默认采样或导出', (t) => {
  const { root, app } = fixture(t);
  const examples = [
    ['review', '--schema'],
    ['review', '手机 作品', '--source', 'export-job', '--job', '已完成-job-原版本', '--first-last', '--target-width', '390', '--max-edge', '1280', '--home', '隔离 home'],
  ];
  for (const args of examples) {
    const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim().split('\n').length, 1);
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
  }
});

test('P2场景合同发现与明确源码参数文件沿安装CLI原样传递', (t) => {
  const { root, app } = fixture(t);
  const examples = [
    ['scene-read', '--schema'],
    ['scene-revise', '--schema'],
    ['scene-read', '共享 场景项目', '真实-clip-id', '--home', '隔离 home'],
    ['scene-revise', '共享 场景项目', '--args', '完整 新版本参数.json', '--home', '隔离 home'],
  ];
  for (const args of examples) {
    const result = spawnSync(process.execPath, [wrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim().split('\n').length, 1);
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root });
  }
});

test('MiMo素材生成沿已安装CLI，JSON路径和明确服务模型逐字保留且不带凭据', (t) => {
  const { root, app } = fixture(t);
  const args = ['get', '创业 视频', 'tts', '--args', '语音 参数.json', '--via', 'mimo', '--model', 'mimo-v2.5-tts', '--home', '隔离 应用数据'];
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


test('经目录软链或 Windows junction 启动时真实执行 CLI 并保留参数与退出码', (t) => {
  const { root, app } = fixture(t);
  const shortcut = resolve(root, '技能 快捷目录');
  symlinkSync(dirname(wrapper), shortcut, process.platform === 'win32' ? 'junction' : 'dir');
  const aliasedWrapper = resolve(shortcut, 'video-creation.mjs');
  const args = ['motion-inspect', '项目 有空格', 'clip-a', '--home', '隔离 home'];
  for (const flags of [[], ['--preserve-symlinks-main']]) {
    const success = spawnSync(process.execPath, [...flags, aliasedWrapper, '--app-root', app, ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(success.status, 0, success.stderr);
    assert.deepEqual(JSON.parse(success.stdout), { args, cwd: root });
  }
  const failure = spawnSync(process.execPath, [aliasedWrapper, '--app-root', app, '--fail'], { cwd: root, encoding: 'utf8' });
  assert.equal(failure.status, 7);
  assert.deepEqual(JSON.parse(failure.stdout).args, ['--fail']);
});

test('标准输入导入包装器不执行入口，也不把不存在的 argv 当作路径解析', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-'], {
    input: `await import(${JSON.stringify(pathToFileURL(wrapper).href)});`, encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, '');
});
