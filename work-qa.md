# Work page — 2026-10-12

The user requested publishing GitHub projects within Work, split into GitHub
projects and work experience. Experience was initially left empty, then populated
on 2026-10-12 using their supplied résumé and current-role update.

## Content and sources

Five pinned public repositories are curated in `src/work-content.js`. Descriptions are
paraphrases of repository content, not claims of sole authorship or performance.
No private repositories, employers, dates, or project metrics are inferred.

- [Paper Agent](https://github.com/DuoChen-317/paper_agent): README, tree, requirements.
- [ETFALL](https://github.com/DuoChen-317/etfall): README and tree (evaluation,
  LoRA training, vector steering, figures); toxicity is described as a partial metric.
- [axground3D](https://github.com/DuoChen-317/axground3D): README with both authors
  and original repository citation; displayed as collaborative research.
- [TopoG](https://github.com/DuoChen-317/topog): README with both authors and
  original repository citation; displayed as collaborative research.
- [SVRLLM](https://github.com/YichengDuan/svrllm): public README describing VLM,
  RAG, video retrieval, and vector storage. Pinned on the user's profile even
  though its repository owner is YichengDuan; link directly to the actual owner.

Follow-up: the user requested all pinned projects. GitHub GraphQL `pinnedItems`
returned axground3D, topog, YichengDuan/svrllm, etfall, and paper_agent. All five
are displayed. The user subsequently requested removing the personal website
entry; Work now contains only those five pinned projects.

Empty repositories, the profile README, and an OpenMRS fork without a verified
contribution summary are not promoted as portfolio projects. This is a showcase
with repository links; it does not deploy the Python projects as running services.

## Implementation

Shared content and renderer produce `/work/` and `/zh/work/`. `work.css` is loaded
only on these routes. The experience script is also scoped to Work; no new
framework or API dependency is added.
Native disclosure elements expose details with keyboard and pointer access.
Anchor navigation retains deep links and has sticky-header clearance. Employer
experience is a separate reverse-chronological timeline using supplied history.
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

## Experience timeline follow-up — 2026-10-12

The résumé's internship and research sections were extracted and visually checked
against the rendered PDF. Current employment comes from the user's own update;
they explicitly confirmed March 23, 2026 as the start date. Research has no supplied
employer and is marked as research, not employment. Chinese uses the supplied
legal company names; English now uses verified English names. Only professional history is published;
the original PDF and its contact details remain outside the production artifacts.

History is newest first: current Huayan AI application engineering (VLA, WAM,
simulation); June–September 2025 LLM inference/evaluation research; November
2023–April 2024 Haoyun digitalization-engineering internship. No employment
outcomes, performance numbers, or unsupported platforms are added.

The main information is always visible; native disclosures contain the details.
One finite node-ring animation introduces the current
role, and scrolling fills the rail and updates the active node. Hover feedback is
subtle; reduced motion draws the rail statically and cancels the ring animation.
Browser QA covered 1280 px desktop, 800 px tablet, and 375 px English/Chinese
mobile without horizontal overflow. Keyboard PageDown moved the active node to
the internship and filled the rail. Browser warning/error log was empty. Three
behavior tests passed: rail/node progression, live reduced-motion preference
changes, and frame coalescing/cleanup. No claim of complete WCAG compliance.

## Compact disclosures and company names follow-up — 2026-10-12

At the user's request, every experience starts closed, showing only its date,
type, company, role, and team. Clicking the overview opens the summary,
responsibilities, and focus areas; a second click closes them. Native details
also work with Enter/Space and expose expanded/collapsed accessibility states.
Opening/closing recalculates the rail via ResizeObserver and a capture-phase
toggle listener; the script does not control disclosure state.

Verified English names:

- Guangdong Huayan Robotics Co., Ltd. — [company English website footer](https://www.huayan-robotics.net/about-us/about).
- Haoyun Technologies Co., Ltd. — [company 2025 annual report, company information](https://static.cninfo.com.cn/finalpage/2026-04-23/1225155551.PDF).

Desktop English QA verified all three closed states, both English company names,
mouse expansion, and keyboard collapse. Chinese mobile QA at 375 px verified
default closed states, expansion, and no horizontal overflow. Native accessibility
snapshots omit responsibility lists when closed and expose them when opened.
The original three timeline behavior tests still pass.
