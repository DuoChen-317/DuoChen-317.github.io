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
