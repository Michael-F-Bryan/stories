import { execFile } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { EPUB_AUTHOR, EPUB_LANGUAGE } from './config.js';
import { discoverBooks } from './books.js';
import { readBuildConfiguration } from './build-site.js';

const execFileAsync = promisify(execFile);
const defaultUnzipPath = 'unzip';
const forbiddenFragments = ['plan/', 'bible/', 'ledgers/', 'log.md', 'handoff.md'];

function decodeXmlEntities(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function stripTags(value) {
  return decodeXmlEntities(value.replace(/<[^>]+>/g, '')).trim();
}

function extractTagText(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, 'i'));
  return match ? stripTags(match[1]) : null;
}

function parseAttributes(attributeSource) {
  const attributes = {};
  for (const match of attributeSource.matchAll(/([:\w.-]+)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

function resolveZipEntryPath(basePath, relativeHref) {
  const baseDirectory = path.posix.dirname(basePath);
  return path.posix.normalize(path.posix.join(baseDirectory, relativeHref));
}

async function unzip(epubPath, args, unzipPath) {
  try {
    const { stdout } = await execFileAsync(unzipPath, args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    return stdout;
  } catch (error) {
    const stderr = String(error?.stderr ?? '').trim();
    const context = `${epubPath}: ${unzipPath} failed while reading EPUB archive`;
    throw new Error(stderr ? `${context}\n${stderr}` : context, { cause: error });
  }
}

async function listArchiveEntries(epubPath, unzipPath) {
  const stdout = await unzip(epubPath, ['-Z1', epubPath], unzipPath);
  return stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

async function readArchiveEntry(epubPath, entryPath, unzipPath) {
  return unzip(epubPath, ['-p', epubPath, entryPath], unzipPath);
}

function parseContainer(containerXml) {
  const match = containerXml.match(/full-path="([^"]+)"/i);
  if (!match) {
    throw new Error('EPUB container.xml is missing the OPF package path');
  }

  return match[1];
}

function parseManifest(opfXml) {
  return [...opfXml.matchAll(/<item\b([^>]*)\/?>/g)].map((match) => {
    const attributes = parseAttributes(match[1]);
    return {
      id: attributes.id ?? null,
      href: attributes.href ?? null,
      mediaType: attributes['media-type'] ?? null,
      properties: attributes.properties ?? '',
    };
  });
}

function parseSpine(opfXml) {
  return [...opfXml.matchAll(/<itemref\b([^>]*)\/?>/g)].map((match) => parseAttributes(match[1]).idref ?? null).filter(Boolean);
}

function extractNavLinks(navXml) {
  const tocNav = [...navXml.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/gi)].find((match) => {
    const attributes = parseAttributes(match[1]);
    return attributes['epub:type'] === 'toc' || attributes.role === 'doc-toc';
  });
  if (!tocNav) {
    throw new Error('EPUB navigation document is missing its table of contents');
  }

  return [...tocNav[2].matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: match[1],
    title: stripTags(match[2]),
  }));
}

function extractXhtmlHeading(xhtml) {
  const headingMatch = xhtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!headingMatch) {
    return null;
  }

  return stripTags(headingMatch[1]);
}

function findForbiddenReferences(value, sourcePath) {
  const hits = [];
  for (const fragment of forbiddenFragments) {
    if (value.includes(fragment)) {
      hits.push({ sourcePath, fragment });
    }
  }
  return hits;
}

function appendIfPresent(list, sourcePath, value) {
  if (typeof value !== 'string' || value === '') {
    return;
  }

  list.push(...findForbiddenReferences(value, sourcePath));
}

export async function inspectEpub(epubPath, { unzipPath = defaultUnzipPath } = {}) {
  const entries = await listArchiveEntries(epubPath, unzipPath);
  const readEntry = (entryPath) => readArchiveEntry(epubPath, entryPath, unzipPath);
  const forbiddenReferences = [];
  appendIfPresent(forbiddenReferences, '[archive listing]', entries.join('\n'));

  const containerXml = await readEntry('META-INF/container.xml');
  appendIfPresent(forbiddenReferences, 'META-INF/container.xml', containerXml);
  const opfPath = parseContainer(containerXml);
  const opfXml = await readEntry(opfPath);
  appendIfPresent(forbiddenReferences, opfPath, opfXml);

  const metadata = {
    title: extractTagText(opfXml, 'dc:title') ?? '',
    author: extractTagText(opfXml, 'dc:creator') ?? '',
    language: extractTagText(opfXml, 'dc:language') ?? '',
  };

  const manifest = parseManifest(opfXml);
  const spineIds = parseSpine(opfXml);
  const manifestById = new Map(manifest.filter((item) => item.id).map((item) => [item.id, item]));
  const navItem = manifest.find((item) => item.properties.split(/\s+/).includes('nav')) ?? null;
  const coverItem = manifest.find((item) => item.properties.split(/\s+/).includes('cover-image')) ?? null;
  const stylesheetItems = manifest.filter((item) => item.mediaType === 'text/css');
  const navPath = navItem?.href ? resolveZipEntryPath(opfPath, navItem.href) : null;
  const navXml = navPath ? await readEntry(navPath) : '';

  if (navPath) {
    appendIfPresent(forbiddenReferences, navPath, navXml);
  }

  const navEntries = navPath ? extractNavLinks(navXml) : [];
  const spineEntries = [];
  for (const idref of spineIds) {
    const item = manifestById.get(idref);
    if (!item?.href) {
      continue;
    }

    const href = resolveZipEntryPath(opfPath, item.href);
    const xhtml = await readEntry(href);
    appendIfPresent(forbiddenReferences, href, xhtml);
    spineEntries.push({
      idref,
      href,
      title: extractXhtmlHeading(xhtml),
      mediaType: item.mediaType,
    });
  }

  const navChapterTitles = navEntries.map((entry) => entry.title).filter(Boolean);
  const chapterHrefs = new Set(
    navPath
      ? navEntries.map((entry) => entry.href.split(/[?#]/, 1)[0]).filter(Boolean).map((href) => resolveZipEntryPath(navPath, href))
      : [],
  );
  const spineChapterTitles = spineEntries.filter((entry) => chapterHrefs.has(entry.href)).map((entry) => entry.title).filter(Boolean);
  const stylesheetPaths = stylesheetItems.map((item) => resolveZipEntryPath(opfPath, item.href ?? '')).filter(Boolean);
  const stylesheetContents = [];
  for (const stylesheetPath of stylesheetPaths) {
    const stylesheetText = await readEntry(stylesheetPath);
    appendIfPresent(forbiddenReferences, stylesheetPath, stylesheetText);
    stylesheetContents.push(stylesheetText);
  }

  if (coverItem?.href) {
    const coverImagePath = resolveZipEntryPath(opfPath, coverItem.href);
    return {
      epubPath,
      entries,
      opfPath,
      metadata,
      manifest,
      spineEntries,
      navPath,
      navEntries,
      navChapterTitles,
      spineChapterTitles,
      coverImagePath,
      stylesheetPaths,
      stylesheetContents,
      forbiddenReferences,
    };
  }

  return {
    epubPath,
    entries,
    opfPath,
    metadata,
    manifest,
    spineEntries,
    navPath,
    navEntries,
    navChapterTitles,
    spineChapterTitles,
    coverImagePath: null,
    stylesheetPaths,
    stylesheetContents,
    forbiddenReferences,
  };
}

function ensureExactInventory(expectedPaths, actualPaths) {
  const expected = new Set(expectedPaths);
  const actual = new Set(actualPaths);

  for (const pathName of actual) {
    for (const fragment of forbiddenFragments) {
      if (pathName.includes(fragment)) {
        throw new Error(`${pathName}: forbidden generated path`);
      }
    }
  }

  for (const expectedPath of expected) {
    if (!actual.has(expectedPath)) {
      throw new Error(`${expectedPath}: missing expected output`);
    }
  }

  for (const actualPath of actual) {
    if (!expected.has(actualPath)) {
      throw new Error(`${actualPath}: unexpected generated output path`);
    }
  }
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

async function verifyPublicTextReferences(outputDir, relativePaths) {
  const textExtensions = new Set(['.css', '.html']);

  for (const relativePath of relativePaths) {
    if (!textExtensions.has(path.extname(relativePath))) {
      continue;
    }

    const contents = await readFile(path.join(outputDir, relativePath), 'utf8');
    const [firstHit] = findForbiddenReferences(contents, relativePath);
    if (firstHit) {
      throw new Error(`${relativePath}: forbidden reference ${firstHit.fragment}`);
    }
  }
}

function buildExpectedInventory(books) {
  const expected = ['.story-publish-output', 'assets/styles.css', 'index.html'];

  for (const book of books) {
    expected.push(path.posix.join(book.slug, 'index.html'));
    if (book.coverPath) {
      expected.push(path.posix.join(book.slug, path.basename(book.coverPath)));
    }

    expected.push(path.posix.join(book.slug, `${book.slug}.epub`));
    for (const chapter of book.chapters) {
      expected.push(path.posix.join(book.slug, `${chapter.numberLabel}-${chapter.slug}`, 'index.html'));
    }
  }

  expected.sort();
  return expected;
}

function verifyEpubInspection(inspection, book, { author, language }) {
  const expectedTitles = book.chapters.map((chapter) => chapter.title);

  if (inspection.metadata.title !== book.title) {
    throw new Error(`${inspection.epubPath}: expected title ${book.title} but found ${inspection.metadata.title}`);
  }

  if (inspection.metadata.author !== author) {
    throw new Error(`${inspection.epubPath}: expected author ${author} but found ${inspection.metadata.author}`);
  }

  if (inspection.metadata.language !== language) {
    throw new Error(`${inspection.epubPath}: expected language ${language} but found ${inspection.metadata.language}`);
  }

  if (JSON.stringify(inspection.navChapterTitles) !== JSON.stringify(expectedTitles)) {
    throw new Error(`${inspection.epubPath}: chapter nav is out of order`);
  }

  if (JSON.stringify(inspection.spineChapterTitles) !== JSON.stringify(expectedTitles)) {
    throw new Error(`${inspection.epubPath}: chapter spine is out of order`);
  }

  if (book.coverPath && !inspection.coverImagePath) {
    throw new Error(`${inspection.epubPath}: missing embedded cover image`);
  }

  if (!book.coverPath && inspection.coverImagePath) {
    throw new Error(`${inspection.epubPath}: coverless books must not gain a fake cover`);
  }

  if (!inspection.stylesheetPaths.some((href) => href.endsWith('.css'))) {
    throw new Error(`${inspection.epubPath}: EPUB CSS was not embedded`);
  }

  if (inspection.forbiddenReferences.length > 0) {
    const firstHit = inspection.forbiddenReferences[0];
    throw new Error(`${inspection.epubPath}: forbidden reference ${firstHit.fragment} found in ${firstHit.sourcePath}`);
  }
}

export async function verifyOutput({ books, outputDir, author = EPUB_AUTHOR, language = EPUB_LANGUAGE, unzipPath = defaultUnzipPath }) {
  if (!books) {
    throw new Error('verifyOutput requires books');
  }

  if (!outputDir) {
    throw new Error('verifyOutput requires outputDir');
  }

  const actualFiles = await listFiles(outputDir);
  ensureExactInventory(buildExpectedInventory(books), actualFiles);
  await verifyPublicTextReferences(outputDir, actualFiles);

  for (const book of books) {
    const epubPath = path.join(outputDir, book.slug, `${book.slug}.epub`);
    const inspection = await inspectEpub(epubPath, { unzipPath });
    verifyEpubInspection(inspection, book, { author, language });
  }
}

export function readVerifyOutputConfiguration(env = process.env, cwd = process.cwd()) {
  const configuration = readBuildConfiguration(env, cwd);
  return {
    worksRoot: configuration.worksRoot,
    outputDir: configuration.outputDir,
    unzipPath: env.STORIES_UNZIP_PATH ?? defaultUnzipPath,
  };
}

async function main() {
  const { worksRoot, outputDir, unzipPath } = readVerifyOutputConfiguration();
  const books = await discoverBooks(worksRoot);
  await verifyOutput({ books, outputDir, unzipPath });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exitCode = 1;
  });
}
