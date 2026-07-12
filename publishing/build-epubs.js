import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { discoverBooks, parseChapterMarkdown } from './books.js';
import { EPUB_AUTHOR, EPUB_LANGUAGE, OUTPUT_MARKER_CONTENTS, OUTPUT_MARKER_FILENAME } from './config.js';
import { assertSafeOutputDirectory, readBuildConfiguration } from './build-site.js';

const execFileAsync = promisify(execFile);
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultPandocPath = 'pandoc';
const epubCssPath = path.join(moduleDir, 'epub.css');

function buildPandocArgs(book, epubPath, inputPath, { author, language }) {
  const args = [
    '--from=gfm',
    '--to=epub3',
    '--standalone',
    '--toc',
    '--toc-depth=1',
    '--split-level=1',
    '--metadata', `title=${book.title}`,
    '--metadata', `author=${author}`,
    '--metadata', `lang=${language}`,
    '--css', epubCssPath,
  ];

  if (book.coverPath) {
    args.push('--epub-cover-image', book.coverPath);
  }

  args.push('-o', epubPath, inputPath);
  return args;
}

function escapeMarkdownInlineText(value) {
  return value.replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g, '\\$&');
}

async function writePandocInput(book, temporaryRoot) {
  const chapters = [];
  for (const chapter of book.chapters) {
    const sourceMarkdown = await readFile(chapter.sourcePath, 'utf8');
    const parsedChapter = parseChapterMarkdown(sourceMarkdown, chapter.sourcePath);
    chapters.push(`# ${escapeMarkdownInlineText(parsedChapter.title)}\n\n${parsedChapter.bodyMarkdown.trim()}`);
  }

  const inputPath = path.join(temporaryRoot, `${book.slug}.md`);
  await writeFile(inputPath, `${chapters.join('\n\n')}\n`, 'utf8');
  return inputPath;
}

async function runPandoc(pandocPath, args, { bookSlug, epubPath }) {
  try {
    await execFileAsync(pandocPath, args, { maxBuffer: 20 * 1024 * 1024 });
  } catch (error) {
    const stderr = String(error?.stderr ?? '').trim();
    const context = `pandoc failed for ${bookSlug} -> ${epubPath}`;
    const message = stderr ? `${context}\n${stderr}` : context;
    throw new Error(message, { cause: error });
  }
}

async function requirePublisherOwnedSite(outputDir) {
  const markerPath = path.join(outputDir, OUTPUT_MARKER_FILENAME);
  try {
    const markerContents = await readFile(markerPath, 'utf8');
    if (markerContents === OUTPUT_MARKER_CONTENTS) {
      return;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw new Error(`${markerPath}: unable to verify publisher-owned site output`, { cause: error });
    }
  }

  throw new Error(`${outputDir}: EPUB generation requires an existing publisher-owned site output`);
}

export async function buildEpubs({
  worksRoot,
  outputDir,
  author = EPUB_AUTHOR,
  language = EPUB_LANGUAGE,
  pandocPath = defaultPandocPath,
  safeRoot,
} = {}) {
  if (!worksRoot) {
    throw new Error('buildEpubs requires worksRoot');
  }

  if (!outputDir) {
    throw new Error('buildEpubs requires outputDir');
  }

  const resolvedWorksRoot = path.resolve(worksRoot);
  const safeOutputDir = assertSafeOutputDirectory({
    worksRoot: resolvedWorksRoot,
    outputDir: path.resolve(outputDir),
    safeRoot,
  });
  await requirePublisherOwnedSite(safeOutputDir);
  const books = await discoverBooks(resolvedWorksRoot);
  const createdEpubs = [];
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'stories-epub-'));

  try {
    for (const book of books) {
      const epubPath = path.join(safeOutputDir, book.slug, `${book.slug}.epub`);
      await mkdir(path.dirname(epubPath), { recursive: true });
      const inputPath = await writePandocInput(book, temporaryRoot);
      const pandocArgs = buildPandocArgs(book, epubPath, inputPath, { author, language });
      await runPandoc(pandocPath, pandocArgs, { bookSlug: book.slug, epubPath });
      createdEpubs.push({
        slug: book.slug,
        epubPath,
        chapterCount: book.chapters.length,
      });
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }

  return {
    outputDir: safeOutputDir,
    books,
    epubs: createdEpubs,
  };
}

export function readEpubBuildConfiguration(env = process.env, cwd = process.cwd()) {
  const configuration = readBuildConfiguration(env, cwd);
  return {
    worksRoot: configuration.worksRoot,
    outputDir: configuration.outputDir,
    safeRoot: configuration.safeRoot,
    author: EPUB_AUTHOR,
    language: EPUB_LANGUAGE,
    pandocPath: env.STORIES_PANDOC_PATH ?? defaultPandocPath,
  };
}

async function main() {
  const configuration = readEpubBuildConfiguration();
  await buildEpubs(configuration);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  });
}
