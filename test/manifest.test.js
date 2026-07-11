import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(testDirectory, '..');

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

test('package metadata pins Node 22.23.1', async () => {
  const [packageJson, nvmrc] = await Promise.all([
    readJson(path.join(repoRoot, 'package.json')),
    readFile(path.join(repoRoot, '.nvmrc'), 'utf8'),
  ]);

  assert.equal(packageJson.engines.node, '22.23.1');
  assert.equal(nvmrc.trim(), '22.23.1');
});
