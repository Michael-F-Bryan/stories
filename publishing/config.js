/** @type {readonly string[]} */
export const COVER_FILENAMES = Object.freeze(['cover.jpg', 'cover.png', 'cover.webp']);

export const CHAPTER_FILENAME_PATTERN = /^(?<number>\d{3})-(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

export const PREMISE_LABEL = '**Premise (spoiler-free):**';

export const SITE_TITLE = 'Stories';
export const SITE_DESCRIPTION = 'Sequential fiction by Michael F. Bryan.';
export const DEFAULT_SITE_ORIGIN = 'https://michael-f-bryan.github.io';
export const EPUB_AUTHOR = 'Michael F. Bryan';
export const EPUB_LANGUAGE = 'en-AU';
export const OUTPUT_MARKER_FILENAME = '.story-publish-output';
export const OUTPUT_MARKER_CONTENTS = 'stories-publisher\n';

export const DEFAULT_BASE_PATH = '/';

export function normalizeBasePath(value = DEFAULT_BASE_PATH) {
  const trimmed = String(value ?? '').trim();
  if (trimmed === '' || trimmed === '/') {
    return '/';
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withTrailingSlash = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  return withTrailingSlash.replace(/\/{2,}/g, '/');
}

export function joinBasePath(basePath, relativePath = '') {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedRelativePath = String(relativePath).replace(/^\/+/, '');

  if (normalizedRelativePath === '') {
    return normalizedBasePath;
  }

  return normalizedBasePath === '/' ? `/${normalizedRelativePath}` : `${normalizedBasePath}${normalizedRelativePath}`;
}

export function normalizeSiteOrigin(value = DEFAULT_SITE_ORIGIN) {
  let url;
  try {
    url = new URL(String(value));
  } catch (error) {
    throw new Error(`${value}: site origin must be an absolute HTTP or HTTPS URL`, { cause: error });
  }

  const hasOriginOnly = url.pathname === '/' && url.search === '' && url.hash === '' && url.username === '' && url.password === '';
  if (!['http:', 'https:'].includes(url.protocol) || !hasOriginOnly) {
    throw new Error(`${value}: site origin must contain only an HTTP or HTTPS origin`);
  }

  return url.origin;
}

export function absoluteSiteUrl(siteOrigin, sitePath) {
  return new URL(sitePath, `${normalizeSiteOrigin(siteOrigin)}/`).href;
}
