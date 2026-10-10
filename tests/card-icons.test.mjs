import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise timing and input changes against the actual entry point, without
// requiring browser settings to be changed on the user's computer.
function harness() {
  const listeners = new Map();
  const mediaListeners = new Map();
  const classes = new Set();
  const output = { textContent: '' };
  const caret = { setAttribute() {} };
  const reduced = { matches: false, addEventListener: (_, fn) => mediaListeners.set('reduced', fn) };
  const pointer = { matches: true, addEventListener: (_, fn) => mediaListeners.set('pointer', fn) };
  let focused = false;
  let now = 0;
  let id = 0;
  const timers = new Map();
  const card = {
    querySelector: selector => selector.includes('output') ? output : caret,
    classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) },
    matches: () => focused,
    addEventListener: (name, fn) => listeners.set(name, fn),
  };
  const document = {
    hidden: false,
    querySelectorAll: () => [card],
    addEventListener: (name, fn) => listeners.set(name, fn),
  };
  vm.runInNewContext(fs.readFileSync(new URL(`../src/${process.env.CARD_ENTRY || 'card-icons.js'}`, import.meta.url), 'utf8'), {
    window: { matchMedia: query => query.includes('reduced') ? reduced : pointer }, document,
    setTimeout: (fn, delay) => { const n = ++id; timers.set(n, { fn, time: now + delay }); return n; },
    clearTimeout: n => timers.delete(n),
  });
  return {
    output, classes, document, timers,
    event: (name, event = { pointerType: 'mouse' }) => listeners.get(name)(event),
    focus: enabled => { focused = enabled; listeners.get(enabled ? 'focusin' : 'focusout')(); },
    media: (name, value) => { (name === 'reduced' ? reduced : pointer).matches = value; mediaListeners.get(name)(); },
    tick: elapsed => {
      const end = now + elapsed;
      while (true) {
        const next = [...timers].sort((a, b) => a[1].time - b[1].time)[0];
        if (!next || next[1].time > end) break;
        now = next[1].time; timers.delete(next[0]); next[1].fn();
      }
      now = end;
    },
  };
}

test('hover types a partial word, then the complete phrase once', () => {
  const h = harness(); h.event('pointerenter'); h.tick(360);
  assert.equal(h.output.textContent, 'hel');
  h.tick(2000); assert.equal(h.output.textContent, 'hello world');
  assert.equal(h.timers.size, 0);
});

test('leaving mid-word cancels pending letters; rapid re-entry starts cleanly', () => {
  const h = harness(); h.event('pointerenter'); h.tick(360); h.event('pointerleave');
  h.tick(2000); assert.equal(h.output.textContent, '');
  assert.equal(h.classes.has('is-active'), false);
  h.event('pointerenter'); h.tick(180); assert.equal(h.output.textContent, 'h');
  h.event('pointerleave'); h.event('pointerenter'); h.tick(180);
  assert.equal(h.output.textContent, 'h'); assert.equal(h.timers.size, 1);
});

test('keyboard focus keeps feedback active after pointer leaves, then clears', () => {
  const h = harness(); h.focus(true); h.event('pointerenter'); h.event('pointerleave');
  h.tick(1500); assert.equal(h.output.textContent, 'hello world');
  h.focus(false); assert.equal(h.output.textContent, '');
  assert.equal(h.classes.has('is-active'), false);
});

test('reduced motion resolves text immediately, including preference changes', () => {
  const h = harness(); h.event('pointerenter'); h.tick(270); h.media('reduced', true);
  assert.equal(h.output.textContent, 'hello world'); assert.equal(h.timers.size, 0);
  h.event('pointerleave'); h.event('pointerenter');
  assert.equal(h.output.textContent, 'hello world');
});

test('touch, cancelled pointers and hidden pages do not leave hover running', () => {
  const h = harness(); h.event('pointerenter', { pointerType: 'touch' }); h.tick(2000);
  assert.equal(h.classes.size, 0);
  h.event('pointerenter'); h.event('pointercancel'); h.tick(2000);
  assert.equal(h.output.textContent, '');
  h.event('pointerenter'); h.document.hidden = true; h.event('visibilitychange'); h.tick(2000);
  assert.equal(h.classes.size, 0); assert.equal(h.timers.size, 0);
});
