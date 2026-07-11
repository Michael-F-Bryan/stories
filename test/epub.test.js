import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { buildSite } from '../publishing/build-site.js';
import { buildEpubs, readEpubBuildConfiguration } from '../publishing/build-epubs.js';
import { inspectEpub, readVerifyOutputConfiguration, verifyOutput } from '../publishing/verify-output.js';

const pandocPath = process.env.STORIES_PANDOC_PATH ?? 'pandoc';

async function withTempDir(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publish-site-epub-'));
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

async function writePng(filePath) {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
    'base64',
  );
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, png);
  return filePath;
}

async function createWork(root, slug, { readme, chapters = [], cover, extras = [] }) {
  const workRoot = path.join(root, slug);
  await mkdir(workRoot, { recursive: true });

  if (readme !== undefined) {
    await writeText(path.join(workRoot, 'README.md'), readme);
  }

  if (cover) {
    await writePng(path.join(workRoot, cover));
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

test('buildEpubs generates ordered EPUB3 editions with the repository metadata and cover handling', async () => {
  await withTempDir(async (root) => {
    const worksRoot = path.join(root, 'works');
    const outputDir = path.join(root, 'site');

    await createWork(worksRoot, 'atlas', {
      readme: '# Atlas <One> & Co.\n\n**Premise (spoiler-free):** A mapmaker traces a city that keeps *changing* its name & shape.\n',
      cover: 'cover.png',
      chapters: [
        {
          name: '001-the-door.md',
          body: '# The Door\n\nOpening paragraph with a deliberate chapter one signal.\n',
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
          name: '001-cover.md',
          body: '# Cover\n\nThe road opens.\n',
        },
        {
          name: '002-title-page.md',
          body: '# Title Page\n\nThe second step matters more than the first.\n',
        },
        {
          name: '003-table-of-contents.md',
          body: '# Table of Contents\n\nThe headings refuse to stay administrative.\n',
        },
        {
          name: '004-boreal-and-beyond.md',
          body: '# Boreal & Beyond\n\nThe final chapter shares its title with the book.\n',
        },
      ],
    });

    const built = await buildSite({ worksRoot, outputDir, pathPrefix: '/stories/' });
    assert.equal(await readFile(path.join(outputDir, '.story-publish-output'), 'utf8'), 'stories-publisher\n');
    assert.equal(built.books.length, 2);

    await buildEpubs({ worksRoot, outputDir, pandocPath });
    await verifyOutput({ books: built.books, outputDir });

    const files = await listFiles(outputDir);
    assert.ok(files.includes('atlas/atlas.epub'));
    assert.ok(files.includes('boreal/boreal.epub'));

    const atlasEpub = await inspectEpub(path.join(outputDir, 'atlas', 'atlas.epub'));
    const borealEpub = await inspectEpub(path.join(outputDir, 'boreal', 'boreal.epub'));

    assert.equal(atlasEpub.metadata.title, 'Atlas <One> & Co.');
    assert.equal(atlasEpub.metadata.author, 'Michael F. Bryan');
    assert.equal(atlasEpub.metadata.language, 'en-AU');
    assert.deepStrictEqual(atlasEpub.navChapterTitles, ['The Door', 'The Market', 'The Archive']);
    assert.deepStrictEqual(atlasEpub.spineChapterTitles, ['The Door', 'The Market', 'The Archive']);
    assert.ok(atlasEpub.coverImagePath, 'covered books should carry a cover image inside the EPUB');
    assert.ok(atlasEpub.stylesheetPaths.some((entry) => entry.endsWith('.css')));
    assert.equal(atlasEpub.forbiddenReferences.length, 0);

    assert.equal(borealEpub.metadata.title, 'Boreal & Beyond');
    assert.equal(borealEpub.metadata.author, 'Michael F. Bryan');
    assert.equal(borealEpub.metadata.language, 'en-AU');
    assert.deepStrictEqual(borealEpub.navChapterTitles, ['Cover', 'Title Page', 'Table of Contents', 'Boreal & Beyond']);
    assert.deepStrictEqual(borealEpub.spineChapterTitles, ['Cover', 'Title Page', 'Table of Contents', 'Boreal & Beyond']);
    assert.equal(borealEpub.coverImagePath, null, 'coverless books should not gain a fake cover');
    assert.ok(borealEpub.stylesheetPaths.some((entry) => entry.endsWith('.css')));
    assert.equal(borealEpub.forbiddenReferences.length, 0);
  });
});

test('verifyOutput rejects forbidden generated paths with a path-specific error', async () => {
  await withTempDir(async (root) => {
    const worksRoot = path.join(root, 'works');
    const outputDir = path.join(root, 'site');

    await createWork(worksRoot, 'atlas', {
      readme: '# Atlas\n\n**Premise (spoiler-free):** A mapmaker traces a city.\n',
      chapters: [{ name: '001-the-door.md', body: '# The Door\n\nOpening paragraph.\n' }],
    });

    const built = await buildSite({ worksRoot, outputDir });
    await buildEpubs({ worksRoot, outputDir, pandocPath });

    await writeText(path.join(outputDir, 'atlas', 'plan', 'index.html'), '<p>Forbidden generated path</p>');

    await assert.rejects(
      () => verifyOutput({ books: built.books, outputDir }),
      /atlas\/plan\/index\.html/,
    );

    await rm(path.join(outputDir, 'atlas', 'plan'), { recursive: true });
    const cataloguePath = path.join(outputDir, 'index.html');
    const catalogue = await readFile(cataloguePath, 'utf8');
    await writeText(cataloguePath, `${catalogue}\n<a href="/stories/atlas/plan/secret.html">leak</a>\n`);

    await assert.rejects(
      () => verifyOutput({ books: built.books, outputDir }),
      /index\.html.*plan\//,
    );
  });
});

test('buildEpubs requires an existing publisher-owned site output', async () => {
  await withTempDir(async (root) => {
    const worksRoot = path.join(root, 'works');
    await createWork(worksRoot, 'atlas', {
      readme: '# Atlas\n\n**Premise (spoiler-free):** A mapmaker traces a city.\n',
      chapters: [{ name: '001-the-door.md', body: '# The Door\n\nOpening paragraph.\n' }],
    });

    await assert.rejects(
      () => buildEpubs({ worksRoot, outputDir: path.join(root, 'site'), pandocPath }),
      /publisher-owned site output/,
    );
  });
});

test('EPUB CLI configuration uses PATH-portable external tools by default', () => {
  const cwd = path.join(os.tmpdir(), 'stories-epub-config');
  assert.equal(readEpubBuildConfiguration({}, cwd).pandocPath, 'pandoc');
  assert.equal(readVerifyOutputConfiguration({}, cwd).unzipPath, 'unzip');
});

test('inspectEpub preserves archive and executable context when unzip cannot run', async () => {
  const epubPath = path.join(os.tmpdir(), 'missing-edition.epub');
  await assert.rejects(
    () => inspectEpub(epubPath, { unzipPath: 'stories-unzip-does-not-exist' }),
    (error) => error.message.includes(epubPath) && error.message.includes('stories-unzip-does-not-exist'),
  );
});
