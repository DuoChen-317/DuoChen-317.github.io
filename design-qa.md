# Four-season homepage design QA

**Source visual truth:** `/Users/tiyamo/.codex/generated_images/01a11e6f-bf7f-75a3-a329-1116701723ce/exec-0cc0216e-2ee2-459a-94d6-d82d4c16fca0.png` (selected Japanese-house concept, revised with an autumn switcher). The user's later correction replaces the mock's solid header edge with a vertical fade into the sky.

**Implementation:** `/Users/tiyamo/Documents/ChatGPT/tiyamo_page/site/design-qa-implementation.png`; comparison: `/Users/tiyamo/Documents/ChatGPT/tiyamo_page/site/design-qa-comparison.webp`; focused header and controls: `/Users/tiyamo/Documents/ChatGPT/tiyamo_page/site/design-qa-details.webp`.

**Viewport and normalization:** source 1672 × 941 pixels, normalized to the implementation's 1280 × 720 pixel desktop viewport (1 CSS pixel per output pixel). The browser capture is 1280 × 720 pixels. Both show the English homepage with Autumn selected. Mobile was separately captured at 390 × 667 pixels in `/Users/tiyamo/Documents/ChatGPT/tiyamo_page/design-review/07-season-mobile-local.png`.

## Findings

No actionable P0, P1, or P2 difference remains. The same building, roof, window, curtain, distant mountains, teal sky, gold highlights, centered avatar, headline, social row, and two buttons are present. The season selector is intentionally rendered as a compact accessible button group, and the existing eyebrow, pause button, and scroll hint remain functional. The header's lower border is intentionally absent so the image and navigation merge vertically, per the user's correction.

## Fidelity surfaces

- **Typography:** Existing DM Sans and Space Grotesk remain; the headline, small navigation labels, and body copy retain clear hierarchy and fit in desktop and mobile views.
- **Spacing:** After adjustment, the avatar, heading, buttons, and season selector follow the mock's vertical rhythm; the selector is fully visible at 1280 × 720 and 390 × 667.
- **Color:** Original deep teal, ivory, and warm gold palette is retained. The header fades vertically into the same sky image; a darker header returns on scroll for legibility.
- **Imagery:** Four optimized WebP files share the same building and horizon. Seasonal detail is limited to spring blossoms, summer greenery, autumn foliage, and winter snow. Desktop and mobile crops were visually inspected.
- **Copy:** Existing English and Chinese homepage text remains; the season labels and update note are translated in both languages.

## Comparison history

1. Initial 1280 × 720 capture had a dark one-pixel header seam, clipped season controls on shorter screens, and hero content above the selected mock's position. Removed the home header border, made hero height respond to the viewport, and moved desktop hero content down.
2. Final 1280 × 720 comparison and focused-region comparison show the header blends into the sky and the season controls stay visible. The 390 × 667 mobile capture also keeps the building, text, buttons, and four season controls in view.

## Interaction checks

- Spring, Summer, Autumn, and Winter buttons update the image and pressed state.
- The selected season persists when switching between English and Chinese pages.
- The animation pause button updates its label and state.
- The sticky header becomes opaque after scrolling.
- No browser console errors were observed in the local preview.

**Residual gap:** The operating system's reduced-motion setting was not simulated in the browser, though the implementation includes a static-image fallback for it.

final result: passed
