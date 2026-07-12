import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

import { CHAPTER_FILENAME_PATTERN, COVER_FILENAMES, PREMISE_LABEL } from './config.js';

/**
 * @typedef {Object} DiscoveredChapter
 * @property {number} number
 * @property {string} numberLabel
 * @property {string} slug
 * @property {string} title
 * @property {string | null} description
 * @property {string} sourcePath
 */

/**
 * @typedef {Object} DiscoveredBook
 * @property {string} slug
 * @property {string} title
 * @property {string} synopsis
 * @property {string} readmePath
 * @property {string | null} coverPath
 * @property {DiscoveredChapter[]} chapters
 */

const CHAPTERS_DIRECTORY = 'chapters';
const README_FILENAME = 'README.md';

function compareAscii(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

/**
 * Discover publishable books beneath a works root.
 *
 * @param {string} worksRoot
 * @returns {Promise<DiscoveredBook[]>}
 */
export async function discoverBooks(worksRoot) {
  const entries = await readdir(worksRoot, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort(compareAscii);

  const books = [];
  for (const slug of directories) {
    const book = await discoverBook(path.join(worksRoot, slug), slug);
    if (book) {
      books.push(book);
    }
  }

  return books;
}

async function discoverBook(bookPath, slug) {
  const topLevelEntries = await readdir(bookPath, { withFileTypes: true });
  const topLevelByName = new Map(topLevelEntries.map((entry) => [entry.name, entry]));
  const chapterDirectoryEntry = topLevelByName.get(CHAPTERS_DIRECTORY);

  if (!chapterDirectoryEntry || !chapterDirectoryEntry.isDirectory()) {
    return null;
  }

  const chaptersPath = path.join(bookPath, CHAPTERS_DIRECTORY);
  const chapterEntries = await readdir(chaptersPath, { withFileTypes: true });
  const discoveredChapters = [];

  for (const entry of chapterEntries) {
    if (!entry.isFile()) {
      continue;
    }

    const match = entry.name.match(CHAPTER_FILENAME_PATTERN);
    if (!match?.groups) {
      throw new Error(`${path.join(chaptersPath, entry.name)}: chapter filenames must match NNN-slug.md`);
    }

    discoveredChapters.push({
      number: Number(match.groups.number),
      numberLabel: match.groups.number,
      slug: match.groups.slug,
      sourcePath: path.join(chaptersPath, entry.name),
      filename: entry.name,
    });
  }

  if (discoveredChapters.length === 0) {
    return null;
  }

  const readmePath = path.join(bookPath, README_FILENAME);
  const readmeEntry = topLevelByName.get(README_FILENAME);
  if (!readmeEntry || !readmeEntry.isFile()) {
    throw new Error(`${readmePath}: missing README.md`);
  }

  const coverPath = discoverCoverPath(bookPath, topLevelByName);
  const readme = await readFile(readmePath, 'utf8');
  const title = extractFirstHeading(readme, readmePath);
  const synopsis = extractSynopsis(readme, readmePath);

  discoveredChapters.sort((left, right) => left.number - right.number || compareAscii(left.filename, right.filename));

  const chapters = [];
  const seenNumbers = new Map();
  let expectedNumber = 1;

  for (const chapter of discoveredChapters) {
    const previousPath = seenNumbers.get(chapter.number);
    if (previousPath) {
      throw new Error(`${chapter.sourcePath}: duplicate chapter number ${chapter.numberLabel} (already used by ${previousPath})`);
    }

    if (chapter.number !== expectedNumber) {
      throw new Error(`${chapter.sourcePath}: expected chapter ${padChapterNumber(expectedNumber)} but found ${chapter.numberLabel}`);
    }

    const chapterBody = await readFile(chapter.sourcePath, 'utf8');
    const parsedChapter = parseChapterMarkdown(chapterBody, chapter.sourcePath);

    chapters.push({
      number: chapter.number,
      numberLabel: chapter.numberLabel,
      slug: chapter.slug,
      title: parsedChapter.title,
      description: parsedChapter.description,
      sourcePath: chapter.sourcePath,
    });

    seenNumbers.set(chapter.number, chapter.sourcePath);
    expectedNumber += 1;
  }

  return {
    slug,
    title,
    synopsis,
    readmePath,
    coverPath,
    chapters,
  };
}

export function parseChapterMarkdown(markdown, sourcePath) {
  const hasFrontmatter = /^---\r?\n/.test(markdown);
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  let bodyMarkdown = markdown;
  let description = null;

  if (hasFrontmatter && !frontmatterMatch) {
    throw new Error(`${sourcePath}: invalid chapter frontmatter: missing closing delimiter`);
  }

  if (frontmatterMatch) {
    let metadata;
    try {
      metadata = parseYaml(frontmatterMatch[1]) ?? {};
    } catch (error) {
      throw new Error(`${sourcePath}: invalid chapter frontmatter: ${error.message}`, { cause: error });
    }

    if (metadata.description !== undefined) {
      if (typeof metadata.description !== 'string' || metadata.description.trim() === '') {
        throw new Error(`${sourcePath}: chapter description must be a non-empty string`);
      }
      description = metadata.description.trim();
    }

    bodyMarkdown = markdown.slice(frontmatterMatch[0].length);
  }

  return {
    title: extractFirstHeading(bodyMarkdown, sourcePath),
    description,
    bodyMarkdown,
  };
}

function discoverCoverPath(bookPath, topLevelByName) {
  const coverPaths = COVER_FILENAMES.flatMap((fileName) => {
    const entry = topLevelByName.get(fileName);
    return entry?.isFile() ? [path.join(bookPath, fileName)] : [];
  });

  if (coverPaths.length > 1) {
    throw new Error(`${bookPath}: ambiguous cover files: ${coverPaths.join(', ')}`);
  }

  return coverPaths[0] ?? null;
}

function extractFirstHeading(markdown, sourcePath) {
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^#\s+(.+?)(?:\s+#+)?$/);
    if (match) {
      return match[1].trim();
    }
  }

  throw new Error(`${sourcePath}: missing level-one heading`);
}

function extractSynopsis(markdown, sourcePath) {
  for (const paragraph of markdown.split(/\r?\n\s*\r?\n/)) {
    const trimmed = paragraph.trim();
    if (!trimmed.startsWith(PREMISE_LABEL)) {
      continue;
    }

    const synopsis = trimmed.slice(PREMISE_LABEL.length).trim().replace(/\s+/g, ' ');
    if (!synopsis) {
      break;
    }

    return synopsis;
  }

  throw new Error(`${sourcePath}: missing paragraph labelled ${PREMISE_LABEL}`);
}

function padChapterNumber(number) {
  return String(number).padStart(3, '0');
}
