import Eleventy from '@11ty/eleventy';
import MarkdownIt from 'markdown-it';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { discoverBooks } from './books.js';
import { DEFAULT_BASE_PATH, SITE_TITLE, joinBasePath, normalizeBasePath } from './config.js';

const markdownIt = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: false,
  typographer: true,
});

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteInputDir = path.join(repoRoot, 'site');
const outputMarkerFilename = '.story-publish-output';
const outputMarkerContents = 'stories-publisher\n';

function trimBlankEdges(lines) {
  let start = 0;
  let end = lines.length;

  while (start < end && lines[start].trim() === '') {
    start += 1;
  }

  while (end > start && lines[end - 1].trim() === '') {
    end -= 1;
  }

  return lines.slice(start, end);
}

function stripFirstChapterHeading(markdown, sourcePath) {
  const lines = markdown.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^#\s+/.test(line.trim()));

  if (headingIndex === -1) {
    throw new Error(`${sourcePath}: missing level-one heading`);
  }

  const [headingLine] = lines.splice(headingIndex, 1);
  const headingMatch = headingLine.match(/^#\s+(.+?)(?:\s+#+)?\s*$/);
  if (!headingMatch) {
    throw new Error(`${sourcePath}: missing level-one heading`);
  }

  return {
    title: headingMatch[1].trim(),
    markdown: trimBlankEdges(lines).join('\n'),
  };
}

function renderChapterHtml(markdown) {
  return markdownIt.render(markdown);
}

function normalizeChapterPath(bookSlug, numberLabel, chapterSlug) {
  return path.posix.join(bookSlug, `${numberLabel}-${chapterSlug}`, 'index.html');
}

function normalizeBookPath(bookSlug) {
  return path.posix.join(bookSlug, 'index.html');
}

function normalizeCoverPath(bookSlug, coverFilename) {
  return path.posix.join(bookSlug, coverFilename);
}

function withPositionLabel(index, total) {
  return `Chapter ${index + 1} of ${total}`;
}

async function prepareBuildData(books, pathPrefix) {
  const preparedBooks = [];
  const flatChapters = [];

  for (const book of books) {
    const chapterCount = book.chapters.length;
    const coverFilename = book.coverPath ? path.basename(book.coverPath) : null;
    const bookOutputPath = normalizeBookPath(book.slug);
    const bookUrl = joinBasePath(pathPrefix, bookOutputPath);
    const epubOutputPath = path.posix.join(book.slug, `${book.slug}.epub`);
    const epubUrl = joinBasePath(pathPrefix, epubOutputPath);
    const coverOutputPath = coverFilename ? normalizeCoverPath(book.slug, coverFilename) : null;
    const coverUrl = coverOutputPath ? joinBasePath(pathPrefix, coverOutputPath) : null;

    const preparedChapters = [];
    for (const [index, chapter] of book.chapters.entries()) {
      const sourceMarkdown = await readFile(chapter.sourcePath, 'utf8');
      const strippedChapter = stripFirstChapterHeading(sourceMarkdown, chapter.sourcePath);
      const chapterOutputPath = normalizeChapterPath(book.slug, chapter.numberLabel, chapter.slug);
      const chapterUrl = joinBasePath(pathPrefix, chapterOutputPath);
      const previousChapter = index > 0 ? preparedChapters[index - 1] : null;
      const nextChapter = index < chapterCount - 1 ? book.chapters[index + 1] : null;
      const preparedChapter = {
        number: chapter.number,
        numberLabel: chapter.numberLabel,
        slug: chapter.slug,
        title: chapter.title ?? strippedChapter.title,
        sourcePath: chapter.sourcePath,
        outputPath: chapterOutputPath,
        url: chapterUrl,
        positionLabel: withPositionLabel(index, chapterCount),
        previousUrl: previousChapter?.url ?? null,
        previousTitle: previousChapter?.title ?? null,
        nextUrl: nextChapter ? joinBasePath(pathPrefix, normalizeChapterPath(book.slug, nextChapter.numberLabel, nextChapter.slug)) : null,
        nextTitle: nextChapter?.title ?? null,
        bookSlug: book.slug,
        bookTitle: book.title,
        bookUrl,
        bookEpubUrl: epubUrl,
        chapterCount,
        bodyHtml: renderChapterHtml(strippedChapter.markdown),
      };

      preparedChapters.push(preparedChapter);
      flatChapters.push(preparedChapter);
    }

    const chapterLinks = preparedChapters.map(({ title, url }) => ({ title, url }));
    for (const preparedChapter of preparedChapters) {
      preparedChapter.bookChapters = chapterLinks;
    }

    preparedBooks.push({
      slug: book.slug,
      title: book.title,
      cataloguePosition: preparedBooks.length + 1,
      synopsis: book.synopsis,
      synopsisHtml: markdownIt.renderInline(book.synopsis),
      readmePath: book.readmePath,
      coverPath: book.coverPath,
      coverFilename,
      coverOutputPath,
      coverUrl,
      chapterCount,
      bookOutputPath,
      url: bookUrl,
      epubOutputPath,
      epubUrl,
      startReadingUrl: preparedChapters[0]?.url ?? null,
      latestChapterUrl: preparedChapters.at(-1)?.url ?? null,
      latestChapterTitle: preparedChapters.at(-1)?.title ?? null,
      latestChapterLabel: preparedChapters.at(-1)?.positionLabel ?? null,
      chapters: preparedChapters,
    });
  }

  return { preparedBooks, flatChapters };
}

async function copyCovers(books, outputDir) {
  for (const book of books) {
    if (!book.coverPath || !book.coverOutputPath) {
      continue;
    }

    const targetPath = path.join(outputDir, book.coverOutputPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(book.coverPath, targetPath);
  }
}

async function copyStaticAssets(outputDir) {
  const targetDir = path.join(outputDir, 'assets');
  await mkdir(targetDir, { recursive: true });
  await copyFile(path.join(siteInputDir, 'assets', 'styles.css'), path.join(targetDir, 'styles.css'));
}

async function createRenderer({ books, chapters, site, outputDir }) {
  const eleventy = new Eleventy(siteInputDir, outputDir, {
    configPath: false,
    pathPrefix: site.pathPrefix,
    quietMode: true,
    source: 'script',
    runMode: 'build',
    config: async (config) => {
      config.addGlobalData('site', site);
      config.addGlobalData('books', books);
      config.addGlobalData('chapters', chapters);
      config.addGlobalData('bookCount', books.length);
    },
  });

  await eleventy.write();
}

function isSameOrWithin(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return relativePath === '' || (!relativePath.startsWith(`..${path.sep}`) && relativePath !== '..' && !path.isAbsolute(relativePath));
}

function unsafeOutputError(outputDir, detail = 'choose a dedicated directory that does not overlap source files') {
  return new Error(`${outputDir}: unsafe output directory; ${detail}`);
}

function canonicalizePotentialPath(candidatePath) {
  let currentPath = path.resolve(candidatePath);
  const missingSegments = [];

  while (true) {
    try {
      return path.join(realpathSync(currentPath), ...missingSegments.reverse());
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }

      const parentPath = path.dirname(currentPath);
      if (parentPath === currentPath) {
        throw error;
      }

      missingSegments.push(path.basename(currentPath));
      currentPath = parentPath;
    }
  }
}

function assertNoSymlinkComponents(safeRoot, outputDir) {
  const relativePath = path.relative(safeRoot, outputDir);
  let currentPath = safeRoot;

  for (const segment of relativePath.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);
    try {
      if (lstatSync(currentPath).isSymbolicLink()) {
        throw unsafeOutputError(outputDir, `path component ${currentPath} is a symbolic link`);
      }
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  }
}

function assertOwnedExistingOutput(outputDir) {
  let outputStats;
  try {
    outputStats = lstatSync(outputDir);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  const markerPath = path.join(outputDir, outputMarkerFilename);
  try {
    const markerStats = lstatSync(markerPath);
    const markerContents = readFileSync(markerPath, 'utf8');
    if (!outputStats.isDirectory() || markerStats.isSymbolicLink() || !markerStats.isFile() || markerContents !== outputMarkerContents) {
      throw unsafeOutputError(outputDir, 'existing output is not owned by the stories publisher');
    }
  } catch (error) {
    if (error?.message?.includes('unsafe output directory')) {
      throw error;
    }
    throw unsafeOutputError(outputDir, 'existing output is not owned by the stories publisher');
  }
}

export function assertSafeOutputDirectory({ worksRoot, outputDir, safeRoot = path.dirname(path.resolve(worksRoot)) }) {
  const resolvedSafeRoot = path.resolve(safeRoot);
  const resolvedWorksRoot = path.resolve(worksRoot);
  const resolvedOutputDir = path.resolve(outputDir);
  const filesystemRoot = path.parse(resolvedOutputDir).root;

  if (resolvedOutputDir === filesystemRoot || resolvedOutputDir === resolvedSafeRoot || !isSameOrWithin(resolvedSafeRoot, resolvedOutputDir)) {
    throw unsafeOutputError(resolvedOutputDir, `output must be a dedicated directory inside ${resolvedSafeRoot}`);
  }

  assertNoSymlinkComponents(resolvedSafeRoot, resolvedOutputDir);

  const canonicalSafeRoot = canonicalizePotentialPath(resolvedSafeRoot);
  const canonicalWorksRoot = canonicalizePotentialPath(resolvedWorksRoot);
  const canonicalOutputDir = canonicalizePotentialPath(resolvedOutputDir);
  const canonicalRepoRoot = canonicalizePotentialPath(repoRoot);
  const overlapsWorks = isSameOrWithin(canonicalWorksRoot, canonicalOutputDir) || isSameOrWithin(canonicalOutputDir, canonicalWorksRoot);
  const containsRepository = isSameOrWithin(canonicalOutputDir, canonicalRepoRoot);

  if (!isSameOrWithin(canonicalSafeRoot, canonicalOutputDir) || overlapsWorks || containsRepository) {
    throw unsafeOutputError(resolvedOutputDir);
  }

  assertOwnedExistingOutput(resolvedOutputDir);
  return resolvedOutputDir;
}

export async function buildSite({ worksRoot, outputDir, pathPrefix = DEFAULT_BASE_PATH, safeRoot }) {
  const resolvedWorksRoot = path.resolve(worksRoot);
  const safeOutputDir = assertSafeOutputDirectory({ worksRoot: resolvedWorksRoot, outputDir, safeRoot });
  const normalizedPathPrefix = normalizeBasePath(pathPrefix);
  const books = await discoverBooks(resolvedWorksRoot);
  const { preparedBooks, flatChapters } = await prepareBuildData(books, normalizedPathPrefix);
  const site = {
    title: SITE_TITLE,
    pathPrefix: normalizedPathPrefix,
    homeUrl: joinBasePath(normalizedPathPrefix, 'index.html'),
    stylesUrl: joinBasePath(normalizedPathPrefix, 'assets/styles.css'),
  };

  await rm(safeOutputDir, { recursive: true, force: true });
  await mkdir(safeOutputDir, { recursive: true });
  await writeFile(path.join(safeOutputDir, outputMarkerFilename), outputMarkerContents, 'utf8');

  await createRenderer({ books: preparedBooks, chapters: flatChapters, site, outputDir: safeOutputDir });
  await copyStaticAssets(safeOutputDir);
  await copyCovers(preparedBooks, safeOutputDir);

  return {
    site,
    books: preparedBooks,
    chapters: flatChapters,
    outputDir: safeOutputDir,
  };
}

export function readBuildConfiguration(env = process.env, cwd = process.cwd()) {
  const resolvedCwd = path.resolve(cwd);
  const worksRoot = env.STORIES_WORKS_ROOT ? path.resolve(resolvedCwd, env.STORIES_WORKS_ROOT) : path.join(resolvedCwd, 'works');
  const outputDir = env.STORIES_OUTPUT_DIR ? path.resolve(resolvedCwd, env.STORIES_OUTPUT_DIR) : path.join(resolvedCwd, '_site');

  if (outputDir === resolvedCwd || !isSameOrWithin(resolvedCwd, outputDir)) {
    throw new Error(`${outputDir}: unsafe output directory; CLI output must be a dedicated directory inside ${resolvedCwd}`);
  }

  return {
    worksRoot,
    outputDir: assertSafeOutputDirectory({ worksRoot, outputDir, safeRoot: resolvedCwd }),
    pathPrefix: normalizeBasePath(env.STORIES_SITE_BASE_PATH ?? DEFAULT_BASE_PATH),
    safeRoot: resolvedCwd,
  };
}

async function main() {
  const configuration = readBuildConfiguration();
  await buildSite(configuration);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  });
}
