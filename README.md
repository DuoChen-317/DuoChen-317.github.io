# Tiyamo personal website

Source: https://github.com/DuoChen-317/DuoChen-317.github.io  
GitHub Pages: https://duochen-317.github.io/  
Custom domain: https://tiyamo.top/

A bilingual static portfolio. English is the default at `/`; Chinese pages live under `/zh/`.

## Edit the site

- Text for both languages and page templates: `build.mjs`
- Base styles: `dist/assets/styles.css`
- Current visual system and responsive refinements: `dist/assets/design.css`
- Seasonal homepage scene and pause control: `dist/assets/hero-wallpaper.js`; four optimized image assets: `dist/assets/season-*.webp`
- Homepage card interaction source: `src/card-paper.js` (bundled into `dist/assets/card-paper.js`)
- Mobile navigation: `dist/assets/app.js`
- Avatar: `dist/assets/avatar.jpg`
- Approved homepage paper icons: `dist/assets/card-paper-v5.json` maps the six transparent WebP states; presentation: `dist/assets/card-scenes-v5.css`
- Social icons: `icons/*.svg` (inlined by `build.mjs`)

The social icons are [Font Awesome Free](https://fontawesome.com/) SVGs, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original attribution
comments are retained in each SVG and in the generated HTML.

Run `npm run build` after changing `build.mjs`. The generated HTML in `dist/` is tracked for static hosting.
The homepage follows the visitor’s local month: March–May spring, June–August summer, September–November autumn, and December–February winter. It rechecks the calendar while open and when the visitor returns to the tab; a four-icon glass dock at the lower right allows a temporary manual choice. Refreshing the page returns to the actual season; no device preference is saved. Seasonal color grading applies equally to the static and animated image: soft pink spring, clear teal summer, warm golden autumn, and cool blue winter. Particles are cherry blossom petals, hovering fireflies, maple leaves, and a mixture of fine snow and six-armed snowflakes respectively.

`lucide-static` supplies the small category and navigation icons at build time.
The large illustrations use matte paper-cut assets. Hover or keyboard focus types
`hello world` on the laptop, rocks the controller, and opens the cat's eyes with
two gentle ear movements. Reduced-motion preferences disable animation. Run
`npm ci` after cloning the repository to install dependencies locally.

## Preview locally

Run `python3 -m http.server 4173 --directory dist` and open `http://localhost:4173/`.

All portfolio and résumé entries are clearly marked placeholders until real content is supplied.

## Publish with GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and publishes `dist/` whenever `main` changes. GitHub Pages is configured to use **GitHub Actions**. The workflow publishes the English homepage at `/` and Chinese pages under `/zh/`.

For future changes: edit the relevant text in `build.mjs` or styling in `dist/assets/styles.css`, run `npm run build`, then commit and push to `main`. GitHub Actions will publish the new version automatically.

The HTML uses root-relative asset and page URLs, so the initial GitHub Pages address should be a root site such as `https://<username>.github.io/`. A custom domain such as `tiyamo.top` also works once its DNS points to GitHub Pages. A project site under `https://<username>.github.io/<repository>/` would need a base-path change first.
