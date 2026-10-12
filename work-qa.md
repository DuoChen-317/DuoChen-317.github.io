# Work page — 2026-10-12

The user requested publishing GitHub projects within Work, split into GitHub
projects and work experience. They explicitly chose to leave experience empty.

## Content and sources

Six public repositories are curated in `src/work-content.js`. Descriptions are
paraphrases of repository content, not claims of sole authorship or performance.
No private repositories, employee history, dates, or project metrics are inferred.

- [Paper Agent](https://github.com/DuoChen-317/paper_agent): README, tree, requirements.
- [ETFALL](https://github.com/DuoChen-317/etfall): README and tree (evaluation,
  LoRA training, vector steering, figures); toxicity is described as a partial metric.
- [axground3D](https://github.com/DuoChen-317/axground3D): README with both authors
  and original repository citation; displayed as collaborative research.
- [TopoG](https://github.com/DuoChen-317/topog): README with both authors and
  original repository citation; displayed as collaborative research.
- [Tiyamo](https://github.com/DuoChen-317/DuoChen-317.github.io): existing site implementation.
- [SVRLLM](https://github.com/YichengDuan/svrllm): public README describing VLM,
  RAG, video retrieval, and vector storage. Pinned on the user's profile even
  though its repository owner is YichengDuan; link directly to the actual owner.

Follow-up: the user requested all pinned projects. GitHub GraphQL `pinnedItems`
returned axground3D, topog, YichengDuan/svrllm, etfall, and paper_agent. All five
are now displayed; the existing personal website entry is retained as well.

Empty repositories, the profile README, and an OpenMRS fork without a verified
contribution summary are not promoted as portfolio projects. This is a showcase
with repository links; it does not deploy the Python projects as running services.

## Implementation

Shared content and renderer produce `/work/` and `/zh/work/`. `work.css` is loaded
only on these routes. There is no extra client script, framework, or API dependency.
Native disclosure elements expose details with keyboard and pointer access.
Anchor navigation retains deep links and has sticky-header clearance. Employer
experience is a separate honest empty state awaiting the user's supplied history.
Existing site fonts, palette, navigation and footer are reused. Earlier Work HTML
is preserved locally in ignored `versions/work-before-2026-10-12/`.

## Verification before publication

- Production build succeeded (16 routes); existing interaction suites passed 5 + 5.
- Desktop 1280 px: five projects, two modules, visible keyboard focus; Enter opens
  and closes project details.
- Tablet 800 px: two columns, no document horizontal overflow.
- Mobile 375 px: English and Chinese stack in one column without horizontal overflow;
  expanded details also remain within the viewport.
- Chinese work-experience anchor changes the URL and scrolls to the visible module.
- Language switch preserves the Work route; repository URLs match public API results.
- Browser warning/error log was empty. Corrected the GitHub SVG fill after visual QA.
- No claims of complete WCAG conformance or backend project deployment.

Browser screenshots live outside the deployed directory in `../design-research/`.
