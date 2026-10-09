# Tiyamo personal website

A bilingual static portfolio. English is the default at `/`; Chinese pages live under `/zh/`.

## Edit the site

- Text for both languages and page templates: `build.mjs`
- Colors, layout, and responsive styles: `dist/assets/styles.css`
- Mobile navigation: `dist/assets/app.js`
- Avatar: `dist/assets/avatar.jpg`

Run `npm run build` after changing `build.mjs`. The generated HTML in `dist/` is tracked for static hosting.

## Preview locally

Run `python3 -m http.server 4173 --directory dist` and open `http://localhost:4173/`.

All portfolio and résumé entries are clearly marked placeholders until real content is supplied.

## Publish with GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and publishes `dist/` whenever `main` changes. In the GitHub repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow then publishes the English homepage at `/` and Chinese pages under `/zh/`.

The HTML uses root-relative asset and page URLs, so the initial GitHub Pages address should be a root site such as `https://<username>.github.io/`. A custom domain such as `tiyamo.top` also works once its DNS points to GitHub Pages. A project site under `https://<username>.github.io/<repository>/` would need a base-path change first.
