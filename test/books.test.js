import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { discoverBooks } from '../publishing/books.js';

async function withTempDir(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publish-books-'));
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
    await writeText(path.join(workRoot, cover), 'cover');
  }

  for (const chapter of chapters) {
    await writeText(path.join(workRoot, 'chapters', chapter.name), chapter.body);
  }

  for (const extra of extras) {
    await writeText(path.join(workRoot, extra.path), extra.body);
  }

  return workRoot;
}
function errorPattern(messageParts) {
  return new RegExp(messageParts.map(escapeRegExp).join('.*'));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('discoverBooks reads multiple books, orders chapters, and ignores unpublished work areas', async () => {
  await withTempDir(async (worksRoot) => {
    const alphaRoot = await createWork(worksRoot, 'alpha', {
      readme: '# Alpha Story\n\n**Premise (spoiler-free):** A locksmith joins a skyship crew.\n\nMore text.',
      cover: 'cover.png',
      chapters: [
        {
          name: '002-second-step.md',
          body: 'Preamble\n\n# Second Step\n\nChapter two.',
        },
        {
          name: '001-first-step.md',
          body: 'Preamble\n\n# First Step\n\nChapter one.',
        },
      ],
      extras: [
        { path: 'plan/001-secret.md', body: '# Secret chapter\n\nShould never be published.' },
        { path: 'bible/world.md', body: '# Hidden world note\n\nShould never be published.' },
        { path: 'ledgers/timeline.md', body: '# Hidden ledger\n\nShould never be published.' },
        { path: 'log.md', body: '# Hidden log\n\nShould never be published.' },
        { path: 'handoff.md', body: '# Hidden handoff\n\nShould never be published.' },
      ],
    });

    await createWork(worksRoot, 'beta', {
      readme: '# Beta Story\n\n**Premise (spoiler-free):** A cartographer maps a falling city.\n',
      chapters: [
        {
          name: '001-the-drop.md',
          body: '# The Drop\n\nChapter one.',
        },
      ],
    });

    await createWork(worksRoot, 'scaffolded', {
      readme: '# Scaffolded Work\n\n**Premise (spoiler-free):** Still being planned.\n',
    });

    const books = await discoverBooks(worksRoot);

    assert.deepStrictEqual(
      books.map((book) => book.slug),
      ['alpha', 'beta'],
    );

    const alpha = books[0];
    assert.equal(alpha.slug, 'alpha');
    assert.equal(alpha.title, 'Alpha Story');
    assert.equal(alpha.synopsis, 'A locksmith joins a skyship crew.');
    assert.equal(Object.hasOwn(alpha, 'sourcePath'), false);
    assert.equal(alpha.readmePath, path.join(alphaRoot, 'README.md'));
    assert.equal(alpha.coverPath, path.join(alphaRoot, 'cover.png'));
    assert.deepStrictEqual(
      alpha.chapters.map(({ number, slug, title, sourcePath }) => ({ number, slug, title, sourcePath })),
      [
        {
          number: 1,
          slug: 'first-step',
          title: 'First Step',
          sourcePath: path.join(alphaRoot, 'chapters', '001-first-step.md'),
        },
        {
          number: 2,
          slug: 'second-step',
          title: 'Second Step',
          sourcePath: path.join(alphaRoot, 'chapters', '002-second-step.md'),
        },
      ],
    );

    const beta = books[1];
    assert.equal(beta.slug, 'beta');
    assert.equal(beta.title, 'Beta Story');
    assert.equal(beta.synopsis, 'A cartographer maps a falling city.');
    assert.equal(Object.hasOwn(beta, 'sourcePath'), false);
    assert.equal(beta.coverPath, null);
    assert.deepStrictEqual(
      beta.chapters.map(({ number, slug, title, sourcePath }) => ({ number, slug, title, sourcePath })),
      [
        {
          number: 1,
          slug: 'the-drop',
          title: 'The Drop',
          sourcePath: path.join(worksRoot, 'beta', 'chapters', '001-the-drop.md'),
        },
      ],
    );
  });
});

test('discoverBooks rejects a publishable work with a missing README using a path-specific error', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'README.md'),
        'missing README.md',
      ]),
    );
  });
});

test('discoverBooks uses the first README H1 as the book title', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: 'Intro paragraph.\n\n# First Title\n\n## Not the title\n\n# Second Title\n\n**Premise (spoiler-free):** The first heading wins.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
    });

    const [book] = await discoverBooks(worksRoot);
    assert.equal(book.title, 'First Title');
  });
});

test('discoverBooks uses the first spoiler-free premise paragraph as the synopsis', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** First synopsis.\n\nA gap paragraph.\n\n**Premise (spoiler-free):** Second synopsis.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
    });

    const [book] = await discoverBooks(worksRoot);
    assert.equal(book.synopsis, 'First synopsis.');
  });
});

test('discoverBooks uses the first H1 in a chapter as the chapter title', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Chapter headings should be stable.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: 'Preface\n\n# First Chapter Title\n\n## Not the title\n\n# Second Chapter Title\n\nChapter one.',
        },
      ],
    });

    const [book] = await discoverBooks(worksRoot);
    assert.equal(book.chapters[0].title, 'First Chapter Title');
  });
});

test('discoverBooks reads a spoiler-safe description from chapter frontmatter', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'described', {
      readme: '# Described Story\n\n**Premise (spoiler-free):** Chapter descriptions should travel with their source.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '---\ndescription: "A careful opening with <sharp> edges & quoted stakes."\n---\n\n# Begin\n\nChapter one.',
        },
      ],
    });

    const [book] = await discoverBooks(worksRoot);

    assert.equal(book.chapters[0].description, 'A careful opening with <sharp> edges & quoted stakes.');
  });
});

test('discoverBooks rejects non-string chapter descriptions with a path-specific error', async () => {
  await withTempDir(async (worksRoot) => {
    const chapterPath = path.join(worksRoot, 'broken', 'chapters', '001-begin.md');
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Metadata failures should identify their source.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '---\ndescription:\n  - not\n  - text\n---\n\n# Begin\n\nChapter one.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([chapterPath, 'chapter description must be a non-empty string']),
    );
  });
});

test('discoverBooks rejects malformed chapter frontmatter with a path-specific error', async () => {
  await withTempDir(async (worksRoot) => {
    const chapterPath = path.join(worksRoot, 'broken', 'chapters', '001-begin.md');
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Broken metadata should never leak into chapter prose.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '---\ndescription: "Never closed"\n\n# Begin\n\nChapter one.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([chapterPath, 'invalid chapter frontmatter']),
    );
  });
});

test('discoverBooks rejects missing README titles with a path-specific error', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: 'No heading here.\n\n**Premise (spoiler-free):** A story needs a title.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'README.md'),
        'missing level-one heading',
      ]),
    );
  });
});

test('discoverBooks rejects missing spoiler-free premises with a path-specific error', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\nNo premise paragraph here.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'README.md'),
        'Premise (spoiler-free)',
      ]),
    );
  });
});

test('discoverBooks rejects chapters that are missing a level-one heading', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** A chapter needs a title.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: 'Chapter one without a title.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'chapters', '001-begin.md'),
        'missing level-one heading',
      ]),
    );
  });
});

test('discoverBooks rejects malformed chapter filenames in chapters/', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Chapter filenames should be exact.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
        {
          name: 'chapter-two.md',
          body: '# Chapter Two\n\nThis should not be accepted.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'chapters', 'chapter-two.md'),
        'chapter filenames must match',
      ]),
    );
  });
});

test('discoverBooks rejects duplicate chapter numbers', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Numbers must be unique.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
        {
          name: '001-again.md',
          body: '# Again\n\nDuplicate chapter number.',
        },
      ],
    });

    await assert.rejects(async () => discoverBooks(worksRoot), (error) => {
      assert.match(error.message, /duplicate chapter number 001/);
      assert.match(
        error.message,
        new RegExp(
          `${escapeRegExp(path.join(worksRoot, 'broken', 'chapters', '001-begin.md'))}|${escapeRegExp(path.join(worksRoot, 'broken', 'chapters', '001-again.md'))}`,
        ),
      );
      return true;
    });
  });
});

test('discoverBooks rejects non-contiguous chapter numbers', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Numbers must be contiguous.\n',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
        {
          name: '003-missing.md',
          body: '# Missing\n\nThere is a gap.',
        },
      ],
    });

    await assert.rejects(
      () => discoverBooks(worksRoot),
      errorPattern([
        path.join(worksRoot, 'broken', 'chapters', '003-missing.md'),
        'expected chapter 002 but found 003',
      ]),
    );
  });
});

test('discoverBooks rejects ambiguous covers', async () => {
  await withTempDir(async (worksRoot) => {
    await createWork(worksRoot, 'broken', {
      readme: '# Broken Story\n\n**Premise (spoiler-free):** Covers must be unambiguous.\n',
      cover: 'cover.jpg',
      chapters: [
        {
          name: '001-begin.md',
          body: '# Begin\n\nChapter one.',
        },
      ],
      extras: [
        { path: 'cover.webp', body: 'second cover' },
      ],
    });

    await assert.rejects(async () => discoverBooks(worksRoot), (error) => {
      assert.match(error.message, /ambiguous cover files/);
      assert.match(error.message, new RegExp(escapeRegExp(path.join(worksRoot, 'broken'))));
      assert.match(error.message, new RegExp(escapeRegExp(path.join(worksRoot, 'broken', 'cover.jpg'))));
      assert.match(error.message, new RegExp(escapeRegExp(path.join(worksRoot, 'broken', 'cover.webp'))));
      return true;
    });
  });
});
