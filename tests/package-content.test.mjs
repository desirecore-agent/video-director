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

test('安装审批补证说明保留授权边界且双语入口指向同一规则', () => {
  const skill = readFileSync(resolve(root, 'skills/video-creation/SKILL.md'), 'utf8');
  for (const requirement of [
    '读取脚本及其直接调用，核实直接副作用和写入范围',
    '只有公开的审批拒绝理由明确指出材料不足',
    '补证仍在既有目标与权限内',
    '无须仅为只读补证再次询问用户',
    '取得实质新材料后，携完整请求与新增证据正常发起新的审批',
    '保留原拒绝记录，新审批通过前不执行被拒操作',
    '用户明确拒绝、政策禁止、超出范围',
    '新增付费、上传、删除等仍需授权时停止相应操作',
    '含糊理由不得解释为材料不足',
    '不拆命令或换工具绕过拒绝',
    '不在没有新材料时循环重试',
    '只读补证不扩大读域，也不读取凭据',
  ]) assert(skill.includes(requirement), `缺少审批边界：${requirement}`);
  const link = '(skills/video-creation/SKILL.md#修改与冲突)';
  const chinese = readFileSync(resolve(root, 'README.md'), 'utf8');
  const english = readFileSync(resolve(root, 'README.en-US.md'), 'utf8');
  assert(chinese.split('\n').some((line) => line.includes('只读补证与新审批边界') && line.includes(link)));
  assert(english.split('\n').some((line) => line.includes('read-only evidence gathering') && line.includes(link)));
});

test('服务健康不替代正式数据根的渲染依赖就绪', () => {
  const skill = readFileSync(resolve(root, 'skills/video-creation/SKILL.md'), 'utf8');
  for (const requirement of [
    'HTTP 健康或工程可读取不等于渲染依赖就绪',
    '历史候选数据根的准备结果不能证明当前正式数据根已就绪',
    '按当前安装的实际数据根及公开运行合同核实依赖状态',
    '必要准备沿用下文的补证与审批边界',
    '不据此重复安装应用或改写平台机制',
  ]) assert(skill.includes(requirement), `缺少依赖就绪边界：${requirement}`);
  const chinese = readFileSync(resolve(root, 'README.md'), 'utf8');
  const english = readFileSync(resolve(root, 'README.en-US.md'), 'utf8');
  assert(chinese.includes('HTTP 健康或工程可读取不等于当前正式数据根的渲染依赖就绪'));
  assert(english.includes('HTTP health or a readable project does not prove rendering dependencies are ready in the current formal data root'));
  assert(english.includes('preparation in a historical candidate data root cannot replace that verification'));
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


test('content validation rejects a missing or invalid bundled portrait', (t) => {
  const copy = mkdtempSync(resolve(tmpdir(), 'video-director-avatar-'));
  t.after(() => rmSync(copy, { recursive: true, force: true }));
  cpSync(root, copy, { recursive: true, filter: (source) => !source.split('/').includes('.git') });
  const avatar = resolve(copy, 'assets/avatar.png');
  writeFileSync(avatar, 'not an image');
  assert(checkContent(copy).errors.some((error) => error.includes('transparent RGBA PNG')));
  rmSync(avatar);
  assert(checkContent(copy).errors.some((error) => error.includes('portrait is missing')));
});
