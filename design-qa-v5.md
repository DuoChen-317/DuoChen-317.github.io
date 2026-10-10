# Selected paper-cut icon implementation — 2026-10-10

final result: passed

## Scope and source truth

The user selected the third displayed ImageGen result and asked to preserve v4. Only the large Work/Game/Life illustration treatment changes. The incumbent grid, responsive breakpoints, title icons, type, copy, routes and gradient joins remain the layout contract; the selected mock is the icon-style contract.

Exact selected source: `/Users/tiyamo/.codex/generated_images/01a123d7-7622-7480-841c-4e26390c4672/exec-5e38fcfa-c3bb-4532-8f09-7e6265aab2bc.png` (1542 × 1020 pixels). Workspace copy: `../design-research/icon-paper-selected.png`.

Implementation: http://localhost:4176/#featured, English autumn homepage, resting cards. Built-in ImageGen produced individual matching paper-cut laptop, controller and foreground silver tabby/plant assets. No new code-drawn illustration substitutes were used. Existing Lucide category controls remain.

## Comparison evidence

Evidence paths are in `../design-research/`:

- `paper-v5-idle-full.png`: actual browser page, 1280 × 900 CSS viewport, 1× density.
- `paper-v5-desktop.png`: 1180 × 780 section crop, x50/y690.
- `paper-v5-comparison.png`: source normalized to 1180 × 780 beside that implementation crop, source left. Normalization changes source aspect ratio by less than 0.1%.
- `paper-v5-work-comparison.png`, `paper-v5-games-comparison.png`, `paper-v5-life-comparison.png`: paired equal-size focused imagery crops needed to judge texture, silhouettes and object overlap.
- `paper-v5-life-active-full.png`: keyboard-triggered active cat.
- `paper-v5-mobile-full.png`, `paper-v5-mobile.png`, `paper-v5-mobile-geometry.json`: 390 × 844 CSS viewport evidence.
- `paper-v5-tablet-full.png`, `paper-v5-tablet.png`, `paper-v5-tablet-geometry.json`: 820 × 900 CSS viewport evidence.
- `life-paper-states.png`: aligned sleeping/open-eye/twitch raster contact sheet.

Full and focused comparison images were opened together and inspected. Full-page captures include the pre-existing fixed season control; its placement within the document screenshot differs from ordinary viewport scrolling. Initial scrolled mobile/tablet full-page captures also placed the sticky header inside the document capture, so those were recaptured at scrollY 0. These capture artifacts were not classified as changed card layout.

## Required fidelity surfaces

- **Typography:** original DM Sans/Space Grotesk, sizes, weights, line heights, title icon spacing and wrapping retained. The mock approximates those fonts in raster form. Body text remains readable at the three checked widths without truncation. Typing is editable monospace UI text on the laptop display.
- **Spacing/layout:** desktop Work still spans two rows on the left; Game and Life stack on the right. Existing card sizes remain 597.18 × 466px and 514.82 × 224px. No grid declarations were changed. Responsive image sizing preserves full silhouettes; clientWidth equals scrollWidth at 390/820 and Chinese at 1280.
- **Colors/tokens:** cream/gold laptop, dusty blue controller, sage leaves, cream pot and silver cat match the selected direction. Incumbent muted gradients terminate at #16272a; no new bright accents or surfaces.
- **Asset quality:** generated matte paper grain, precise cut contours and modest relief. Cat occludes the pot in front; controller remains slightly left of center. Work blank-screen rendering is clipped to an aligned real raster patch, keeping its outer silhouette fixed. Life patches preserve scene pixels outside the generated eye/ear changes. Alpha edges were inspected on teal. Six fetched states are 720 × 600 and total about 253 KB; raw generated originals remain.
- **Copy/content:** English/Chinese copy, title icons and link targets remain unchanged. Both homepages use the paper assets; category destinations retain their incumbent content.

## Findings and comparison history

No actionable P0/P1/P2 differences remain in the requested scope. The initial full/focused resting comparison found no such visual issue. Asset compression was a technical optimization; after it, a new desktop browser capture and paired full/Work/Game comparisons were inspected, and mobile images were reloaded and verified.

P3: regenerated grain and contours are not pixel-identical to the mock (keyboard details, controller edge depth and leaf proportions). They preserve the selected medium, subjects, palette, scale and composition. Existing panel backgrounds deliberately remain instead of adopting the mock's darker shadow wash.

## Validation

- `npm --prefix site run build -- --preview-v5` passed.
- `CARD_ENTRY=card-paper.js node --test site/tests/card-icons.test.mjs`: 5/5 passed. Original v4 suite also passed 5/5.
- Browser Work completed `hello world`, cleared on exit, and activated with keyboard focus. Controller computed transform was nonidentity under its animation. Cat active image opacity reached 1 and its ear-twitch animation was present. Two aligned raster frames alternate briefly, then open eyes rest.
- Touch hover is excluded; leaving/cancellation clears timers. Reduced motion resolves text immediately and disables animation. Timing was verified with deterministic media mocks, without device setting changes.
- Mobile loaded every illustration and had no horizontal overflow. Desktop/tablet compositions were directly inspected.
- Game link reached /games/. Chinese loaded all three paper scenes without overflow. Language switching worked.
- Browser warning/error log was empty; temporary viewport override was reset.
- Protected default v2 dist files and every v4 preview file remain byte-identical to saved manifests. V3 was not rebuilt. Latest v4 snapshot is `versions/cards-v4-animated/`, and live v4 stays at 4175.

No hardware-device testing or deployment is claimed. New preview remains at 4176.

## Implementation checklist

- [x] Resolve the exact third displayed source.
- [x] Preserve earlier versions.
- [x] Generate and inspect real paper assets.
- [x] Implement typing/controller/cat states.
- [x] Compare full section and focused crops.
- [x] Check responsive layout, routes, language and logs.
- [x] Optimize delivery and recheck image quality.
- [x] Keep a running local preview; leave production unpublished.
