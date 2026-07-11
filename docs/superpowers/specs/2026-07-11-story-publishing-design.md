# Story Publishing Design

## Goal

Publish every conventionally structured story in `works/` as a public, one-page-per-chapter website and downloadable EPUB whenever `main` changes, without exposing planning or continuity material from the private repository.

## Reader job

A reader arriving from a shared link needs to identify a book, begin or resume reading, move through chapters in order, and download the current EPUB without understanding the repository or publishing system.

## Source conventions

A directory under `works/<book-slug>/` is publishable when it contains `README.md` and at least one chapter matching `chapters/NNN-slug.md`.

- Book slug: directory name.
- Book title: first level-one heading in `README.md`.
- Synopsis: the paragraph labelled `Premise (spoiler-free)` in `README.md`.
- Chapter order: lexical filename order, after validating contiguous numeric prefixes.
- Chapter title: first level-one heading in the chapter.
- Cover: optional `cover.jpg`, `cover.png`, or `cover.webp` at the book root.
- Shared author, language, and site title: repository-level publishing configuration.

No per-book manifest is required. Invalid or ambiguous source fails the build rather than being guessed around.

## Public-source boundary

The publisher may read only:

- `works/*/README.md`
- `works/*/cover.{jpg,png,webp}`
- `works/*/chapters/[0-9][0-9][0-9]-*.md`

The generated output must not contain files or path references from `plan/`, `bible/`, `ledgers/`, `log.md`, or `handoff.md`. The build discovers allowed inputs directly instead of copying any `works/` directory recursively.

## Architecture

Eleventy renders the catalogue, book landing pages, and chapter pages from a typed discovery module. Pandoc consumes the same discovered, ordered chapter collection to generate one EPUB per book. A repository-level build command runs both renderers and then validates the complete output.

The implementation stays small:

- a discovery module owns filesystem conventions and validation;
- Eleventy templates own HTML page structure;
- an EPUB build script invokes Pandoc with explicit chapter paths and metadata;
- an output verifier checks expected routes, navigation, EPUB structure, and forbidden-content boundaries;
- GitHub Actions runs the same commands used locally.

## Generated routes

```text
/
├── index.html
├── assets/
└── <book-slug>/
    ├── index.html
    ├── <book-slug>.epub
    └── <chapter-slug>/
        └── index.html
```

The catalogue lists every published book with its cover when present, synopsis, chapter count, latest chapter, Start reading link, and EPUB link. Each book page contains the synopsis, ordered chapter list, Start reading link, and EPUB link. Each chapter page contains the prose, book title, reading position, previous/next navigation, a return-to-book link, and a secondary chapter list.

## Visual direction

The site uses an editorial paperback treatment: warm paper, near-black ink, muted oxblood, aged cream, graphite, and restrained brass. Typography and reading rhythm carry the interface. The signature element is a quiet running folio showing the book and chapter position.

The catalogue resembles an editorial bookshelf rather than an application card grid. Chapter pages avoid documentation sidebars and app controls. Dark mode resembles charcoal paper. The layout must remain readable on phones, respect reduced-motion preferences, and work without client-side JavaScript.

## GitHub Actions

Pull requests and pushes run installation, tests, the production build, EPUB validation, and output-boundary checks. A push to `main` additionally uploads the generated directory as a GitHub Pages artefact and deploys it through the `github-pages` environment.

Generated files are never committed to a deployment branch. The source repository remains private while the Pages deployment is public.

## Failure handling

The build fails with a path-specific message when:

- a book has no usable title or spoiler-free premise;
- chapter filenames are malformed, duplicated, or non-contiguous;
- a chapter has no level-one heading;
- more than one conventional cover exists;
- Pandoc is unavailable or an EPUB render fails;
- generated routes or EPUB navigation/spine ordering do not match discovered chapters;
- forbidden source names or paths appear in output.

A book directory with no chapter files is ignored so a newly scaffolded work is not accidentally published as an empty book.

## Verification

Automated behaviour tests cover discovery, ordering, invalid conventions, title and synopsis extraction, HTML navigation, multiple books, EPUB output and spine order, and spoiler-boundary enforcement. The full production build runs against the real `Support Build` source. Browser checks cover desktop and phone layouts, keyboard navigation, dark mode, overflow, console errors, and the download link.
