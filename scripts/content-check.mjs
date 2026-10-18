import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative, sep } from 'node:path';

/** Content checks supplement, rather than replace, the platform JSON Schema. */
export function checkContent(root) {
  const read = (path) => readFileSync(resolve(root, path), 'utf8');
  const config = JSON.parse(read('agent.json'));
  const errors = [];
  const requireValue = (condition, message) => { if (!condition) errors.push(message); };
  requireValue(config.name === '视频导演', 'Agent display name must be 视频导演.');
  requireValue(config.$schema === 'http://desirecore/schemas/agent-seed.json', 'Package must use the current Agent seed Schema reference.');
  requireValue(config.llm?.routingMode === 'smart' && config.llm?.smart?.profile?.tier, 'Smart routing must declare a profile.');
  for (const key of ['provider', 'providerId', 'model']) requireValue(!Object.hasOwn(config.llm ?? {}, key), `Source must not fix llm.${key}.`);
  requireValue(!Object.hasOwn(config.llm?.smart ?? {}, 'assigned'), 'Source must not persist a concrete Smart assignment.');
  requireValue(!Object.hasOwn(config.llm?.smart ?? {}, 'providerPolicy'), 'Source must not replace the human Provider ceiling.');
  requireValue(!config.default_enabled?.tools?.length, 'Package must not grant additional tools.');
  requireValue(Object.keys(config.mcp_servers ?? {}).length === 0, 'Package must not install a privileged MCP server by default.');
  requireValue(config.compute_credentials?.allowed_providers?.length === 0, 'Package must not grant media credentials by default.');
  const skillIds = config.default_enabled?.skills ?? [];
  requireValue(new Set(skillIds).size === skillIds.length, 'Default skills must be unique.');
  requireValue(skillIds.includes('video-creation'), 'The application integration skill must be enabled.');
  const activeFiles = ['README.md', 'README.en-US.md', 'USAGE.md', 'AGENTS.md', 'instructions.md', 'persona.md', 'principles.md'];
  for (const id of skillIds) {
    requireValue(/^[a-z0-9-]+$/.test(id), `Unsafe skill ID: ${id}`);
    if (!/^[a-z0-9-]+$/.test(id)) continue;
    const skillPath = `skills/${id}/SKILL.md`;
    if (!existsSync(resolve(root, skillPath))) { errors.push(`Missing skill: ${id}`); continue; }
    activeFiles.push(skillPath);
    const text = read(skillPath);
    requireValue(text.startsWith('---\n'), `${skillPath} requires YAML frontmatter.`);
    requireValue(text.match(/^name:\s*(.+)$/m)?.[1] === id, `${skillPath} frontmatter name must match its directory.`);
    requireValue(/^description:\s*\S.+$/m.test(text), `${skillPath} needs a useful trigger description.`);
    if (id !== 'video-creation') {
      requireValue(!/npx\s+openfilm/.test(text), `${skillPath} still invokes the original product download.`);
      requireValue(existsSync(resolve(root, 'skills/video-creation/references/upstream', 'skills', id, 'SKILL.original.md')), `Missing original source for skill ${id}.`);
    }
  }
  for (const path of ['persona.md', 'principles.md']) {
    const text = read(path);
    requireValue(JSON.stringify(text.match(/^## L[012]$/gm)) === JSON.stringify(['## L0', '## L1', '## L2']), `${path} must contain each exact L0/L1/L2 heading once and in order.`);
    const l2 = text.split('## L2\n')[1] ?? '';
    const ids = [];
    for (const chapter of l2.split(/^### /m).slice(1)) {
      try {
        const marker = JSON.parse(chapter.match(/<!-- prompt-section: (.+) -->/)?.[1] ?? 'null');
        requireValue(marker?.mode === 'on_demand' && marker?.id && marker?.desc, `${path} L2 chapter needs an on-demand ID and description.`);
        if (marker?.id) ids.push(marker.id);
      } catch { errors.push(`${path} has an invalid L2 marker.`); }
    }
    requireValue(ids.length > 0 && ids.length === new Set(ids).size, `${path} L2 chapter IDs must be present and unique.`);
  }
  for (const path of activeFiles) {
    const text = read(path);
    requireValue(!/\/(?:Users|Volumes)\//.test(text), `${path} contains a machine-specific absolute path.`);
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue;
      const destination = resolve(dirname(resolve(root, path)), decodeURIComponent(target.split('#')[0]));
      requireValue(!relative(root, destination).split(sep).includes('..'), `${path} links outside the package: ${target}`);
      requireValue(existsSync(destination), `${path} has a missing local link: ${target}`);
    }
  }
  for (const path of ['LICENSE', 'NOTICE', 'licenses/OpenFilm-MIT.txt', 'skills/video-creation/references/upstream/MANUAL.md', 'skills/video-creation/references/upstream/SPEC.md', 'skills/video-creation/scripts/video-creation.mjs']) requireValue(existsSync(resolve(root, path)), `Missing distribution file: ${path}`);
  requireValue(read('licenses/OpenFilm-MIT.txt').includes('Copyright (c) 2026 OpenFilm contributors'), 'The original OpenFilm copyright notice must be preserved.');
  requireValue(!readdirSync(root).some((name) => /^(?:CLAUDE\.md|CLAUDE\.local\.md)$/.test(name)), 'AGENTS.md is the only repository collaboration entrypoint.');
  return { config, errors, skills: skillIds.length };
}
