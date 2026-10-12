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
Scrolling softly fills the rail and updates the active node. Hover and expansion
feedback are subtle; reduced motion draws the rail statically and switches
disclosures immediately. The initial node-ring animation was removed during the
research follow-up so the current node is distinguished by its fill color.
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

## Reference-informed refinement — 2026-10-12

Research and fresh before/after evidence are recorded in `timeline-research.md`.
Default main information and all content remain intact. Dates align to a thinner
single-sided rail; typography and spacing are quieter; hover/open states provide
emphasis. The native disclosure height animates for 240ms via the Web Animations
API, so subsequent entries and rail positions follow the changing content height.
No-JS/native, missing-animation-API, and reduced-motion fallbacks remain usable.

Added five disclosure behavior tests for open/close completion, rapid reversals,
reduced-motion changes, unsupported animation APIs, and native external state
changes. Together with the original timeline tests, eight pass. Browser inspection
confirmed the actual `is-animating` state during closing/opening and a clean settled
state after rapid input. English/Chinese mobile (375px) and tablet (800px) had no
document horizontal overflow; warning/error logs were empty. A mismatched old
mobile screenshot was rejected, not used as responsive evidence.

## Education — 2026-10-12

Added a separate education timeline below work experience and a section link in
the page intro. The owner's résumé v5 supplies the dates, subjects, degrees,
coursework, and master's GPA (3.5/4.0). No original résumé file or contact details
are published. The undergraduate school retains the name supplied in the résumé;
its historical English name is supported by [J. F. Oberlin University's record](https://obiryu.obirin.ac.jp/university/196/).

Both education records start closed. The existing timeline boot now initializes
every timeline root so education gets the same height animation and responsive
rail. Optional team, summary, responsibilities, and tags support education without
empty placeholder content. The mobile expanded toggle keeps its label hidden
so the arrow does not squeeze school names. Checked both languages at 375px and
desktop, course expansion and keyboard collapse, plus the eight existing behavior
tests. Only the two Work pages change in the generated HTML.

## Unified experience — 2026-10-12

At the owner's request, education and professional history now share one timeline
named Experience / 经历. The five records are sorted by descending start date;
overlapping study and research periods retain their actual dates. The intro has
two section links: GitHub projects and Experience. Default collapsed states,
coursework, GPA, work details, and disclosure animations are preserved.

## Master's date and position — 2026-10-12

The owner corrected the master's completion date to January 2026 and requested
it above LLM research. The curated timeline order is now current role, master's,
LLM research, internship, bachelor's. Other records retain their previous order.
Both localized date strings and the machine-readable end date are updated.

## Scroll progress completion — 2026-10-12

Reproduced the rail stopping at 85.9% with the desktop page at its scroll limit:
the last marker remained below the 48%-viewport reading line. Progress now uses
the reachable scroll interval, capped at the page's actual maximum scroll. The
active node follows the same progress, so the final node lights up at completion.
Geometry and page height are recalculated after content expansion or resizing.

Added regression checks for smooth completion below the reading line, content
expansion, and scrolling back upward. All ten timeline/disclosure tests pass.
Browser checks at desktop and 375px confirm progress 1 and the last active node
at page bottom, including an expanded middle entry. No browser warnings/errors.

## Continuous progress dot — 2026-10-12

The previous solid active dot only switched between fixed entry nodes, making it
appear stuck on the preceding entry between nodes. A dedicated dot now sits on
the rail's progress endpoint and uses the same `--career-progress` as the fill.
It moves continuously with scrolling and reverses upward with the line, without
an independent transition that could lag behind. Entry nodes remain fixed;
active, hovered, and expanded entries use border emphasis rather than a second
solid progress dot. The current-role node retains its distinct status color.
Reduced motion keeps the rail and its endpoint static at full progress.
Browser measurements at multiple scroll positions confirm the dot's vertical
offset matches the filled rail height within 0.01px, reverses with upward scroll,
and aligns exactly with the final node at the page bottom. The same check passes
at 375px on the English page with no horizontal overflow. Ten behavior tests pass.

## Restore fixed node highlights — 2026-10-12

The owner clarified that nodes should remain fixed and light up by entry, with
the final node lit at the page bottom. Removed the continuous rail-end dot and
restored the original solid active-node styling. Retained the reachable-scroll
progress fix and added a half-pixel bottom tolerance for rounded scroll geometry.
The bottom regression check also covers fractional scroll offsets.
