import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(repositoryRoot, '.claude', 'skills');

async function readRepositoryFile(...parts) {
  return readFile(path.join(repositoryRoot, ...parts), 'utf8');
}

async function readSkill(skillName, ...parts) {
  return readFile(path.join(skillsRoot, skillName, ...parts), 'utf8');
}

function assertIncludesAll(content, fragments) {
  for (const fragment of fragments) {
    assert.ok(content.includes(fragment), `missing fragment: ${fragment}`);
  }
}

function assertOrdered(content, fragments) {
  let previousIndex = -1;
  for (const fragment of fragments) {
    const index = content.indexOf(fragment);
    assert.ok(index !== -1, `missing ordered stage: ${fragment}`);
    assert.ok(index > previousIndex, `stage appears out of order: ${fragment}`);
    previousIndex = index;
  }
}

test('story-engine owns one positive generation packet and a bounded developmental read', async () => {
  const skill = await readSkill('story-engine', 'SKILL.md');
  const packet = await readSkill('story-engine', 'references', 'generation-packet.md');
  const developmentalRead = await readSkill('story-engine', 'references', 'developmental-read.md');

  assert.match(skill, /^---\nname: story-engine\ndescription: Use when /);
  assertIncludesAll(skill, [
    'generation packet',
    'references/generation-packet.md',
    'references/developmental-read.md',
    'does not own canon',
    'does not rewrite prose',
  ]);

  assertIncludesAll(packet, [
    'Reader pull',
    'Promise movement',
    'Character pressure',
    'Attention field',
    'Causal spine',
    'Shape choice',
    'Explanation budget',
    'Voice anchors',
  ]);

  assertIncludesAll(developmentalRead, [
    'exact quotation',
    'reader consequence',
    'materiality',
    'owning layer',
    'good as-is',
  ]);
});

test('authors-voice routes composition and audit through isolated reference files', async () => {
  const skill = await readSkill('authors-voice', 'SKILL.md');
  const compose = await readSkill('authors-voice', 'references', 'compose.md');
  const audit = await readSkill('authors-voice', 'references', 'audit.md');
  const registry = await readSkill('authors-voice', 'references', 'rule-registry.md');

  assert.ok(skill.length < 7000, 'the main authors-voice router must remain compact');
  assertIncludesAll(skill, [
    'Composition mode',
    'Audit mode',
    'references/compose.md',
    'references/audit.md',
    'Do not load the rule registry while composing',
  ]);
  assert.doesNotMatch(skill, /## Banned AI-prose patterns|Structural budgets|Not X, but Y/);

  assertIncludesAll(compose, [
    'Character-owned attention',
    'Social action beneath dialogue',
    'Uneven narrative weight',
    'Ordinary connective tissue',
    'generation packet',
  ]);
  assert.doesNotMatch(compose, /Banned AI-prose patterns|Not X, but Y|triads\/polysyndeton|max ONE per chapter/);

  assertIncludesAll(audit, [
    'exact text',
    'reader consequence',
    'smallest repair',
    'good as-is',
    'references/rule-registry.md',
  ]);

  assertIncludesAll(registry, [
    'Reader-visible defect',
    'Provenance',
    'Scope',
    'Valid exceptions',
    'Status',
    'plain-speech',
    'slack',
    'cold-reader',
  ]);
});

test('serial-process coordinates state, design, composition, review, grounding, and update in order', async () => {
  const process = await readSkill('serial-process', 'SKILL.md');

  assertIncludesAll(process, [
    'story-engine',
    'authors-voice composition mode',
    'authors-voice audit mode',
    'published chapter text',
    'Ledger honesty',
    'Spoiler discipline',
    'reopen only the affected gates',
  ]);

  assertOrdered(process, [
    '### 1. State',
    '### 2. Design',
    '### 3. Compose',
    '### 4. Develop',
    '### 5. Ground',
    '### 6. Audit',
    '### 7. Update',
  ]);
});

test('repository instructions load each skill only for its owning stage', async () => {
  const instructions = await readRepositoryFile('CLAUDE.md');

  assertIncludesAll(instructions, [
    '.claude/skills/serial-process/SKILL.md',
    '.claude/skills/story-engine/SKILL.md',
    '.claude/skills/authors-voice/SKILL.md',
    'planning story shape',
    'drafting or auditing story prose',
  ]);
});
