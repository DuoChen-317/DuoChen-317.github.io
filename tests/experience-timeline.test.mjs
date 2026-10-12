import test from 'node:test';
import assert from 'node:assert/strict';
import { initExperienceTimeline } from '../src/experience-timeline.js';

function fixture({ reduced = false } = {}) {
  let scroll = 0;
  const events = new Map();
  const frames = new Map();
  let sequence = 0;
  const classes = () => {
    const values = new Set();
    return { add: x => values.add(x), toggle: (x, on) => on ? values.add(x) : values.delete(x), contains: x => values.has(x) };
  };
  const media = { matches: reduced, addEventListener: (_, fn) => { media.change = fn; }, removeEventListener: () => { media.change = null; } };
  const markers = [600, 950, 1400].map(y => ({ getBoundingClientRect: () => ({ top: y - scroll, height: 12 }) }));
  const entries = markers.map(marker => ({ classList: classes(), querySelector: () => marker }));
  const rail = { style: { setProperty(name, value) { this[name] = value; } } };
  const root = { classList: classes(), querySelectorAll: () => entries, querySelector: () => rail, getBoundingClientRect: () => ({ top: 580 - scroll, bottom: 1720 - scroll }) };
  const env = { innerHeight: 900, document: {}, matchMedia: () => media, addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name), requestAnimationFrame: fn => { frames.set(++sequence, fn); return sequence; }, cancelAnimationFrame: id => frames.delete(id) };
  const flush = () => { const tasks = [...frames.values()]; frames.clear(); tasks.forEach(fn => fn()); };
  return { root, env, entries, rail, media, frames, events, flush, scrollTo(y) { scroll = y; events.get('scroll')?.(); } };
}

test('scrolling advances the rail and active experience without hiding content', () => {
  const f = fixture();
  const cleanup = initExperienceTimeline(f.root, f.env);
  assert.equal(f.rail.style['--career-progress'], '0');
  assert(f.entries[0].classList.contains('is-active'));
  f.scrollTo(650); f.flush();
  assert(f.entries[1].classList.contains('is-active'));
  assert(Number(f.rail.style['--career-progress']) > 0);
  assert(Number(f.rail.style['--career-progress']) < 1);
  f.scrollTo(1800); f.flush();
  assert(f.entries[2].classList.contains('is-active'));
  assert.equal(f.rail.style['--career-progress'], '1');
  cleanup();
});

test('reduced motion starts fully drawn and responds to preference changes', () => {
  const f = fixture({ reduced: true });
  const cleanup = initExperienceTimeline(f.root, f.env);
  assert.equal(f.rail.style['--career-progress'], '1');
  assert(f.root.classList.contains('reduced-motion'));
  f.media.matches = false; f.media.change(); f.flush();
  assert.equal(f.rail.style['--career-progress'], '0');
  assert(!f.root.classList.contains('reduced-motion'));
  cleanup();
});

test('rapid scroll events share one frame and cleanup cancels pending work', () => {
  const f = fixture();
  const cleanup = initExperienceTimeline(f.root, f.env);
  f.scrollTo(200); f.scrollTo(300); f.scrollTo(400);
  assert.equal(f.frames.size, 1);
  cleanup();
  assert.equal(f.frames.size, 0);
  assert.equal(f.events.size, 0);
  assert.equal(f.media.change, null);
  assert.doesNotThrow(() => initExperienceTimeline(null, f.env));
});
