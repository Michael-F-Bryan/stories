import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { assertSafeOutputDirectory, buildSite, readBuildConfiguration } from '../publishing/build-site.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function withTempDir(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publish-site-'));
  try {
    return await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, 'utf8');
  return filePath;
}

async function createWork(root, slug, { readme, chapters = [], cover, extras = [] }) {
  const workRoot = path.join(root, slug);
  await mkdir(workRoot, { recursive: true });

  if (readme !== undefined) {
    await writeText(path.join(workRoot, 'README.md'), readme);
  }

  if (cover) {
    await writeText(path.join(workRoot, cover), `cover:${slug}`);
  }

  for (const chapter of chapters) {
    await writeText(path.join(workRoot, 'chapters', chapter.name), chapter.body);
  }

  for (const extra of extras) {
    await writeText(path.join(workRoot, extra.path), extra.body);
  }

  return workRoot;
}

async function listFiles(root) {
  /** @type {string[]} */
  const files = [];

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(path.relative(root, fullPath));
      }
    }
  }

  await walk(root);
  files.sort();
  return files;
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('buildSite renders a prefix-aware editorial catalogue, book pages, and chapter pages from a temporary two-book fixture', async () => {
  await withTempDir(async (root) => {
    const worksRoot = path.join(root, 'works');
    const outputDir = path.join(root, 'site');

    await createWork(worksRoot, 'atlas', {
      readme: '# Atlas <One> & Co.\n\n**Premise (spoiler-free):** A mapmaker traces a city that keeps *changing* its name & shape.\n\nMore notes that should not matter to the reader.',
      cover: 'cover.png',
      chapters: [
        {
          name: '001-the-door.md',
          body: '# The Door\n\nOpening paragraph with raw HTML disabled: <em>not italic</em>.\n\nA second paragraph with **markdown** intact.',
        },
        {
          name: '002-the-market.md',
          body: '# The Market\n\nThe market breathes, and the clerk counts doors.\n',
        },
        {
          name: '003-the-archive.md',
          body: '# The Archive\n\nFinal chapter prose with an `inline code` fragment.\n',
        },
      ],
      extras: [
        { path: 'plan/secret.md', body: '# Hidden planning note' },
        { path: 'bible/world.md', body: '# Hidden bible note' },
        { path: 'ledgers/timeline.md', body: '# Hidden ledger note' },
        { path: 'log.md', body: '# Hidden log note' },
        { path: 'handoff.md', body: '# Hidden handoff note' },
      ],
    });

    await createWork(worksRoot, 'boreal', {
      readme: '# Boreal & Beyond\n\n**Premise (spoiler-free):** A courier walks north with a contract folded inside a compass.\n',
      chapters: [
        {
          name: '001-first-snow.md',
          body: '# First Snow\n\nThe road opens.\n',
        },
      ],
    });

    await buildSite({
      worksRoot,
      outputDir,
      pathPrefix: '/stories/',
    });

    const files = await listFiles(outputDir);
    assert.deepStrictEqual(files, [
      '.story-publish-output',
      'assets/styles.css',
      'atlas/001-the-door/index.html',
      'atlas/002-the-market/index.html',
      'atlas/003-the-archive/index.html',
      'atlas/cover.png',
      'atlas/index.html',
      'boreal/001-first-snow/index.html',
      'boreal/index.html',
      'index.html',
    ]);
    assert.equal(await readFile(path.join(outputDir, '.story-publish-output'), 'utf8'), 'stories-publisher\n');

    for (const forbidden of ['plan/', 'bible/', 'ledgers/', 'log.md', 'handoff.md']) {
      assert.ok(files.every((file) => !file.includes(forbidden)), `unexpected forbidden output path: ${forbidden}`);
    }

    const catalogue = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    assert.match(catalogue, /<title>Stories<\/title>/);
    assert.match(catalogue, /Atlas &lt;One&gt; &amp; Co\./);
    assert.match(catalogue, /A mapmaker traces a city that keeps <em>changing<\/em> its name &amp; shape\./);
    assert.match(catalogue, /3 chapters/);
    assert.match(catalogue, /Latest chapter/i);
    assert.match(catalogue, /Start reading/);
    assert.match(catalogue, /Download EPUB/);
    assert.match(catalogue, /<img[^>]+src="\/stories\/atlas\/cover\.png"/);
    assert.match(catalogue, /book-cover--typographic/);
    assert.match(catalogue, /href="\/stories\/atlas\/index\.html"/);
    assert.match(catalogue, /href="\/stories\/atlas\/001-the-door\/index\.html"/);
    assert.match(catalogue, /href="\/stories\/atlas\/atlas\.epub"/);
    assert.match(catalogue, /href="\/stories\/boreal\/boreal\.epub"/);

    const atlasBook = await readFile(path.join(outputDir, 'atlas', 'index.html'), 'utf8');
    assert.match(atlasBook, /Atlas &lt;One&gt; &amp; Co\./);
    assert.match(atlasBook, /A mapmaker traces a city that keeps <em>changing<\/em> its name &amp; shape\./);
    assert.match(atlasBook, /Ordered chapters/);
    assert.match(atlasBook, /The Archive/);
    assert.match(atlasBook, /href="\/stories\/atlas\/001-the-door\/index\.html"/);
    assert.match(atlasBook, /href="\/stories\/atlas\/atlas\.epub"/);

    const firstChapter = await readFile(path.join(outputDir, 'atlas', '001-the-door', 'index.html'), 'utf8');
    assert.match(firstChapter, /^<!doctype html>/);
    assert.match(firstChapter, /<title>The Door · Stories<\/title>/);
    assert.match(firstChapter, /href="\/stories\/assets\/styles\.css"/);
    assert.match(firstChapter, /Chapter 1 of 3/);
    assert.match(firstChapter, /The Door/);
    assert.match(firstChapter, /Previous/i);
    assert.match(firstChapter, /Next/i);
    assert.match(firstChapter, /Return to book/i);
    assert.match(firstChapter, /href="\/stories\/atlas\/index\.html"/);
    assert.match(firstChapter, /href="\/stories\/atlas\/002-the-market\/index\.html"/);
    assert.match(firstChapter, /&lt;em&gt;not italic&lt;\/em&gt;/);
    assert.match(firstChapter, /<strong>markdown<\/strong>/);
    assert.equal(countOccurrences(firstChapter, '<h1>The Door</h1>'), 1);

    const middleChapter = await readFile(path.join(outputDir, 'atlas', '002-the-market', 'index.html'), 'utf8');
    assert.match(middleChapter, /Chapter 2 of 3/);
    assert.match(middleChapter, /href="\/stories\/atlas\/001-the-door\/index\.html"/);
    assert.match(middleChapter, /href="\/stories\/atlas\/003-the-archive\/index\.html"/);
    assert.match(middleChapter, /The Market/);
    assert.equal(countOccurrences(middleChapter, '<h1>The Market</h1>'), 1);

    const finalChapter = await readFile(path.join(outputDir, 'atlas', '003-the-archive', 'index.html'), 'utf8');
    assert.match(finalChapter, /Chapter 3 of 3/);
    assert.match(finalChapter, /href="\/stories\/atlas\/002-the-market\/index\.html"/);
    assert.doesNotMatch(finalChapter, /Previous[^]*Next/);
    assert.match(finalChapter, /The Archive/);
    assert.equal(countOccurrences(finalChapter, '<h1>The Archive</h1>'), 1);

    const coverCopy = await readFile(path.join(outputDir, 'atlas', 'cover.png'), 'utf8');
    assert.equal(coverCopy, 'cover:atlas');
  });
});

test('buildSite rejects output directories that overlap source or protected roots', async () => {
  await withTempDir(async (root) => {
    const worksRoot = path.join(root, 'works');
    await createWork(worksRoot, 'safe-book', {
      readme: '# Safe Book\n\n**Premise (spoiler-free):** A deliberately small fixture.\n',
      chapters: [{ name: '001-start.md', body: '# Start\n\nSafe prose.\n' }],
    });

    for (const outputDir of [
      root,
      worksRoot,
      path.join(worksRoot, 'generated'),
    ]) {
      await assert.rejects(
        () => buildSite({ worksRoot, outputDir }),
        new RegExp(`${escapeRegExp(outputDir)}.*unsafe output directory|unsafe output directory.*${escapeRegExp(outputDir)}`),
      );
    }

    const unmanagedOutput = path.join(root, 'unmanaged-output');
    const unmanagedSentinel = path.join(unmanagedOutput, 'sentinel.txt');
    await writeText(unmanagedSentinel, 'must survive');
    await assert.rejects(
      () => buildSite({ worksRoot, outputDir: unmanagedOutput }),
      /unsafe output directory/,
    );
    assert.equal(await readFile(unmanagedSentinel, 'utf8'), 'must survive');

    await withTempDir(async (outsideRoot) => {
      const sentinelPath = path.join(outsideRoot, 'site', 'sentinel.txt');
      const linkedOutput = path.join(root, 'linked-output');
      await writeText(sentinelPath, 'must survive');
      await symlink(outsideRoot, linkedOutput, 'dir');

      await assert.rejects(
        () => buildSite({ worksRoot, outputDir: path.join(linkedOutput, 'site') }),
        /unsafe output directory/,
      );
      assert.equal(await readFile(sentinelPath, 'utf8'), 'must survive');
    });
  });
});

test('readBuildConfiguration keeps configured output inside the working directory', () => {
  const cwd = path.join(os.tmpdir(), 'stories-repo');

  assert.throws(
    () => assertSafeOutputDirectory({ worksRoot: path.join(cwd, 'works'), outputDir: path.parse(cwd).root }),
    /unsafe output directory/,
  );

  assert.throws(
    () => readBuildConfiguration({ STORIES_OUTPUT_DIR: '../outside' }, cwd),
    /unsafe output directory/,
  );
  assert.throws(
    () => readBuildConfiguration({ STORIES_OUTPUT_DIR: cwd }, cwd),
    /unsafe output directory/,
  );
  for (const protectedDirectory of ['site', 'publishing']) {
    assert.throws(
      () => readBuildConfiguration({ STORIES_OUTPUT_DIR: protectedDirectory }, repositoryRoot),
      /unsafe output directory/,
    );
  }

  assert.equal(
    readBuildConfiguration({ STORIES_OUTPUT_DIR: 'build/site' }, cwd).outputDir,
    path.join(cwd, 'build', 'site'),
  );
});
