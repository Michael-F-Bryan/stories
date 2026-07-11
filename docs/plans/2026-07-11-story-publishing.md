# Story Publishing Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build and deploy a convention-driven multi-book fiction site with one HTML page per chapter and a downloadable EPUB for each book.

**Architecture:** A small typed JavaScript discovery module validates `works/*` conventions and provides one canonical ordered model to Eleventy and Pandoc. Eleventy renders the static reading site, Pandoc renders EPUBs, and a deterministic verifier checks routes, EPUB navigation/spine order, and the spoiler boundary before GitHub Pages deployment.

**Tech Stack:** Node.js 22, Eleventy 3, Nunjucks, Markdown-It, Pandoc 3, Node test runner, GitHub Actions, GitHub Pages.

---

### Task 1: Establish the publishing project and source model

**Objective:** Add the pinned Node toolchain and a tested discovery module that turns allowed story files into validated book and chapter models.

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.gitignore`
- Create: `publishing/config.js`
- Create: `publishing/books.js`
- Create: `test/books.test.js`

**Steps:**
1. Write behaviour tests using temporary `works/` fixtures for multiple-book discovery, lexical chapter ordering, title and synopsis extraction, optional cover discovery, ignored empty works, malformed filenames, duplicate/non-contiguous chapter numbers, missing headings, and ambiguous covers.
2. Run `npm test -- test/books.test.js` and confirm failures are due to the missing publishing module.
3. Implement the smallest concrete discovery API needed by the tests. Restrict filesystem reads to conventional README, cover, and chapter paths.
4. Run the targeted test and full `npm test` until green.
5. Commit as `feat: add convention-driven story discovery`.

### Task 2: Render the fiction website

**Objective:** Render the catalogue, book pages, and one page per chapter with shared editorial styling and stable path-prefix-aware URLs.

**Files:**
- Create: `eleventy.config.js`
- Create: `site/_data/site.js`
- Create: `site/_data/books.js`
- Create: `site/_includes/layouts/base.njk`
- Create: `site/_includes/layouts/chapter.njk`
- Create: `site/index.njk`
- Create: `site/book.njk`
- Create: `site/chapter.njk`
- Create: `site/assets/styles.css`
- Create: `test/site.test.js`

**Steps:**
1. Write an integration test that builds a temporary two-book fixture and asserts catalogue entries, book routes, ordered chapter routes, previous/next links, EPUB links, escaped metadata, and no forbidden source material.
2. Run the targeted test and confirm it fails because the renderer is absent.
3. Configure Eleventy around the canonical discovery model. Keep templates structural and avoid duplicating source rules.
4. Implement the approved editorial paperback design, responsive chapter layout, dark mode, focus styles, and reduced-motion handling without client-side JavaScript.
5. Run the targeted test and full test suite until green.
6. Run a production HTML build against the repository and inspect generated paths.
7. Commit as `feat: render stories as sequential HTML`.

### Task 3: Build and verify EPUBs

**Objective:** Generate an EPUB for each discovered book from the same ordered chapter model and validate consumer-visible navigation.

**Files:**
- Create: `publishing/build-epubs.js`
- Create: `publishing/verify-output.js`
- Create: `publishing/epub.css`
- Create: `test/epub.test.js`
- Modify: `package.json`

**Steps:**
1. Write integration tests that invoke the EPUB builder on a fixture and inspect the archive metadata, navigation document, OPF manifest, and spine order.
2. Write an output-boundary test that fails when forbidden names or paths appear in the generated site.
3. Run the targeted tests and verify expected failures.
4. Implement explicit Pandoc invocation with title, author, language, optional cover, EPUB CSS, and ordered chapter paths.
5. Implement deterministic output verification for expected routes, EPUB presence and spine order, and forbidden output content.
6. Run targeted tests, full tests, and `npm run build` until green.
7. Open the real generated EPUB with an archive parser and confirm all current chapters appear in order.
8. Commit as `feat: publish downloadable EPUB editions`.

### Task 4: Add CI and GitHub Pages deployment

**Objective:** Run the complete verifier for pull requests and deploy the generated artefact only from `main`.

**Files:**
- Create: `.github/workflows/publish.yml`
- Modify: `README.md`
- Modify: `log.md`
- Create: `test/workflow.test.js`

**Steps:**
1. Write a workflow-structure test asserting pull-request validation, main-only deployment, required Pages permissions, pinned Node and Pandoc setup, dependency caching, production build, and Pages artefact upload.
2. Run the test and confirm failure because the workflow is absent.
3. Add a build job for pull requests and pushes, plus a `main`-only deploy job using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
4. Document local commands, source conventions, generated routes, and the one-time Pages source setting.
5. Record the process change in the repository log without exposing story plans.
6. Run tests and a clean production build.
7. Commit as `ci: publish stories to GitHub Pages`.

### Task 5: Final browser and integration verification

**Objective:** Prove the built artefact works as a reading site before opening the PR.

**Files:**
- Modify only if verification exposes a defect.

**Steps:**
1. Start a local static server for `_site` and verify readiness.
2. Use browser checks at desktop and phone widths for the catalogue, book page, first chapter, middle chapter, and final chapter.
3. Verify chapter navigation, EPUB download response, keyboard focus, dark mode, no horizontal overflow, and no console errors.
4. Run `npm ci`, `npm test`, and `npm run build` from a clean state.
5. Inspect `git diff`, generated output inventory, commit contents, and branch history.
6. Push the branch, create a review PR without auto-merge, and monitor the workflow to completion.
