/** @type {readonly string[]} */
export const COVER_FILENAMES = Object.freeze(['cover.jpg', 'cover.png', 'cover.webp']);

export const CHAPTER_FILENAME_PATTERN = /^(?<number>\d{3})-(?<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

export const PREMISE_LABEL = '**Premise (spoiler-free):**';

export const SITE_TITLE = 'Stories';

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
