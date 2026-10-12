import test from 'node:test';
import assert from 'node:assert/strict';
import { initCareerDisclosure } from '../src/career-disclosure.js';

function fixture(reduced = false) {
  const events = new Map();
  const preferences = new Set();
  const values = new Set();
  const animations = [];
  const summary = { addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name), getBoundingClientRect: () => ({ height: 102 }) };
  const details = {
    open: false,
    classList: { add: x => values.add(x), remove: x => values.delete(x) },
    querySelector: () => summary,
    getBoundingClientRect() {
      const last = animations.at(-1);
      return { height: last && !last.cancelled ? last.currentHeight : this.open ? 320 : 104 };
    },
    get offsetHeight() { return this.getBoundingClientRect().height; },
    get clientHeight() { return this.offsetHeight - 2; },
    animate(frames, options) {
      const animation = { frames, options, currentHeight: Number.parseFloat(frames[0].height), cancelled: false, onfinish: null, cancel() { this.cancelled = true; }, finish() { this.onfinish?.(); } };
      animations.push(animation);
      return animation;
    }
  };
  const motion = { matches: reduced, addEventListener: (_, fn) => preferences.add(fn), removeEventListener: (_, fn) => preferences.delete(fn) };
  const click = () => events.get('click')({ button: 0, defaultPrevented: false, preventDefault() {} });
  return { details, motion, click, animations, values, events, preferences, preference(reduce) { motion.matches = reduce; [...preferences].forEach(fn => fn()); } };
}

test('opening and closing preserve native state while animating the real height', () => {
  const f = fixture(); const cleanup = initCareerDisclosure(f.details, f.motion);
  f.click();
  assert.equal(f.details.open, true);
  assert.deepEqual(f.animations[0].frames, [{ height: '104px' }, { height: '320px' }]);
  f.animations[0].finish();
  assert(!f.values.has('is-animating'));
  f.click();
  assert.equal(f.details.open, true, 'content stays present until closing finishes');
  assert.equal(f.animations[1].frames[1].height, '104px');
  f.animations[1].finish();
  assert.equal(f.details.open, false);
  cleanup();
});

test('rapid reversals start at the visible height and ignore stale completions', () => {
  const f = fixture(); const cleanup = initCareerDisclosure(f.details, f.motion);
  f.click(); const stale = f.animations[0].onfinish;
  f.animations[0].currentHeight = 180;
  f.click();
  assert.equal(f.animations[1].frames[0].height, '180px');
  f.animations[1].currentHeight = 140;
  f.click(); stale();
  assert.equal(f.animations[2].frames[0].height, '140px');
  assert.equal(f.details.open, true);
  f.animations[2].finish();
  assert.equal(f.details.open, true);
  assert(!f.values.has('is-animating'));
  cleanup();
});

test('reduced motion and preference changes settle without lingering animations', () => {
  const f = fixture(true); const cleanup = initCareerDisclosure(f.details, f.motion);
  f.click(); assert.equal(f.details.open, true); assert.equal(f.animations.length, 0);
  f.click(); assert.equal(f.details.open, false);
  f.preference(false); f.click();
  f.preference(true);
  assert.equal(f.details.open, true);
  assert(f.animations[0].cancelled);
  assert(!f.values.has('is-animating'));
  cleanup(); assert.equal(f.events.size, 0); assert.equal(f.preferences.size, 0);
});

test('missing animation support falls back to immediate native disclosure state', () => {
  const f = fixture(); delete f.details.animate;
  const cleanup = initCareerDisclosure(f.details, f.motion);
  f.click(); assert.equal(f.details.open, true);
  f.click(); assert.equal(f.details.open, false);
  cleanup();
});

test('closing still works after a native external action opened the disclosure', () => {
  const f = fixture(); const cleanup = initCareerDisclosure(f.details, f.motion);
  f.details.open = true;
  f.click();
  assert.equal(f.animations[0].frames[1].height, '104px');
  f.animations[0].finish();
  assert.equal(f.details.open, false);
  cleanup();
});
