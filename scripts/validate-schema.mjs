import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const [platformRoot, agentRoot] = process.argv.slice(2);
const platformRequire = createRequire(resolve(platformRoot, 'package.json'));
const Ajv = platformRequire('ajv');
const addFormats = platformRequire('ajv-formats');
const schemas = await import(pathToFileURL(resolve(platformRoot, 'packages/schemas/src/agent/agent-config.ts')).href);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schemas.agentSeedConfigSchema);
const config = JSON.parse(readFileSync(resolve(agentRoot, 'agent.json'), 'utf8'));
if (!validate(config)) {
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Agent seed Schema: passed against ${platformRoot}`);
}
const { parseSkillMarkdown } = await import(pathToFileURL(resolve(platformRoot, 'packages/agent-service/src/skills/parser.ts')).href);
for (const id of config.default_enabled?.skills ?? []) {
  const parsed = parseSkillMarkdown(readFileSync(resolve(agentRoot, 'skills', id, 'SKILL.md'), 'utf8'), id, 'zh-CN');
  if (!parsed.valid || parsed.metadata.name !== id || !parsed.metadata.description) {
    console.error(`Skill ${id}: ${JSON.stringify(parsed.validationErrors ?? parsed.metadata)}`);
    process.exitCode = 1;
  }
}
if (!process.exitCode) console.log('Skill frontmatter: passed the current platform parser and Schema.');
