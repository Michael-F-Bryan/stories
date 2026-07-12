import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = path.join(repositoryRoot, '.github', 'workflows', 'publish.yml');

async function readWorkflow() {
  return readFile(workflowPath, 'utf8');
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function extractJobBlock(workflow, jobName) {
  const lines = workflow.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line === `  ${jobName}:`);

  if (startIndex === -1) {
    throw new Error(`missing job block for ${jobName}`);
  }

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (/^  [A-Za-z0-9_-]+:/.test(lines[index])) {
      endIndex = index;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join('\n');
}

function assertOrdered(content, fragments) {
  let lastIndex = -1;
  for (const fragment of fragments) {
    const index = content.indexOf(fragment);
    assert.ok(index !== -1, `missing fragment: ${fragment}`);
    assert.ok(index > lastIndex, `fragment out of order: ${fragment}`);
    lastIndex = index;
  }
}

test('publish workflow validates pull requests and main pushes, then deploys Pages only from main', async () => {
  const workflow = await readWorkflow();
  const buildJob = extractJobBlock(workflow, 'build');
  const deployJob = extractJobBlock(workflow, 'deploy');

  assert.match(workflow, /on:\n(?:.*\n)*?  pull_request:\n(?:.*\n)*?  push:\n(?:.*\n)*?    branches:\n(?:.*\n)*?      - main/);
  assert.match(workflow, /concurrency:\n(?:.*\n)*?  group: pages\n(?:.*\n)*?  cancel-in-progress: false/);

  assert.equal(countOccurrences(workflow, 'actions/checkout@v4'), 1);
  assert.equal(countOccurrences(workflow, 'pnpm/action-setup@v4'), 1);
  assert.equal(countOccurrences(workflow, 'actions/setup-node@v4'), 1);
  assert.equal(countOccurrences(workflow, 'pandoc/actions/setup@v1'), 1);
  assert.equal(countOccurrences(workflow, 'actions/configure-pages@v5'), 1);
  assert.equal(countOccurrences(workflow, 'actions/upload-pages-artifact@v3'), 1);
  assert.equal(countOccurrences(workflow, 'actions/deploy-pages@v4'), 1);

  assert.match(buildJob, /runs-on: ubuntu-latest/);
  assert.match(buildJob, /permissions:\n\s+contents: read/);
  assert.doesNotMatch(buildJob, /pages: write|id-token: write/);

  assert.match(buildJob, /version: 11\.1\.2/);
  assert.match(buildJob, /node-version: 22\.23\.1/);
  assert.match(buildJob, /cache: pnpm/);
  assert.match(buildJob, /version: 3\.9\.0\.2/);
  assert.match(buildJob, /run: pnpm install --frozen-lockfile/);
  assert.match(buildJob, /run: pnpm test/);
  assert.ok(buildJob.includes('STORIES_BASE_PATH: /stories/'));
  assert.ok(buildJob.includes('STORIES_SITE_BASE_PATH: /stories/'));
  assert.match(buildJob, /run: pnpm build/);
  assert.match(buildJob, /if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/);
  assert.match(buildJob, /uses: actions\/configure-pages@v5/);
  assert.match(buildJob, /uses: actions\/upload-pages-artifact@v3/);
  assert.match(buildJob, /path: _site/);

  assertOrdered(buildJob, [
    'uses: actions/checkout@v4',
    'uses: pnpm/action-setup@v4',
    'uses: actions/setup-node@v4',
    'uses: pandoc/actions/setup@v1',
    'run: pnpm install --frozen-lockfile',
    'run: pnpm test',
    'run: pnpm build',
    'uses: actions/configure-pages@v5',
    'uses: actions/upload-pages-artifact@v3',
  ]);

  assert.match(deployJob, /needs: build/);
  assert.match(deployJob, /if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/);
  assert.match(deployJob, /permissions:\n\s+pages: write\n\s+id-token: write/);
  assert.doesNotMatch(deployJob, /contents: read/);
  assert.match(deployJob, /environment:\n\s+name: github-pages\n\s+url: \$\{\{ steps\.deployment\.outputs\.page_url \}\}/);
  assert.match(deployJob, /uses: actions\/deploy-pages@v4/);
  assert.match(deployJob, /id: deployment/);
});
