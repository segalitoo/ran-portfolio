/* ══════════════════════════════════════════════════════════
   Ran Segal · live tiles
   Loads a recording only when its tile is near the viewport, plays it
   while it is on screen, and stops the moment it is not. Adds one
   global pause control, because a ten second loop that starts itself
   needs a way to be stopped (WCAG 2.2.2).

   It never touches video[data-poster], which is site.js's territory.
   Live tiles use the native poster attribute, so the two never meet.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var KEY = 'rs-motion';
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Read the stored preference before anything can start, so a visitor
     who paused last time never sees a frame of motion first. */
  var paused = false;
  try { paused = localStorage.getItem(KEY) === 'paused'; } catch (e) { /* blocked */ }
  if (paused) root.classList.add('is-paused');

  document.addEventListener('DOMContentLoaded', function () {

    var tiles = [].slice.call(document.querySelectorAll('[data-live]'));
    if (!tiles.length) return;

    var vids = tiles
      .map(function (t) { return t.querySelector('video'); })
      .filter(Boolean);

    /* ── Per tile state ──────────────────────────── */
    vids.forEach(function (v) {
      var tile = v.closest('[data-live]');

      v.addEventListener('playing', function () { tile.classList.add('is-playing'); });
      v.addEventListener('pause', function () { tile.classList.remove('is-playing'); });
      /* A source that will not decode leaves the poster in place and the
         badge hidden, which is the honest outcome rather than a broken box. */
      v.addEventListener('error', function () { tile.classList.remove('is-playing'); });

      if (reduced) return;

      /* A tile sitting under a whole card link cannot own the click: the
         link's overlay is painted on top of it. Announcing it as a button
         and giving it a tab stop promises a press that never lands, and
         the name a screen reader reads there is the caption of the
         recording, not an action. The page wide pause control still
         satisfies WCAG 2.2.2 for these tiles. */
      if (v.closest('[data-live-plain]')) return;

      /* One tile can be stopped without stopping the page. */
      v.setAttribute('tabindex', '0');
      v.setAttribute('role', 'button');
      v.addEventListener('click', function () { toggleOne(v); });
      v.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleOne(v); }
      });
    });

    function wanted(v) {
      /* Play only if motion is allowed, the page is not paused, the tile
         is in view, and nothing has gated it off. The gate exists for
         layouts that stack every tile in one stage: without it all nine
         would be "in view" at once and all nine would fetch. */
      if (reduced || root.classList.contains('is-paused')) return false;
      if (v.closest('[data-live-off]')) return false;
      return v.dataset.near === '1';
    }

    function start(v) {
      if (!wanted(v)) return;
      if (v.preload === 'none') { v.preload = 'metadata'; v.load(); }
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* blocked or undecodable */ });
    }

    function toggleOne(v) {
      if (v.paused) { v.dataset.manual = ''; start(v); }
      else { v.dataset.manual = 'off'; v.pause(); }
    }

    /* ── Near the viewport, not merely in it ─────── */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        v.dataset.near = en.isIntersecting ? '1' : '0';
        if (en.isIntersecting) { if (v.dataset.manual !== 'off') start(v); }
        else v.pause();
      });
    }, { rootMargin: '200px 0px', threshold: 0.25 });

    vids.forEach(function (v) { io.observe(v); });

    /* ── The global control ──────────────────────── */
    if (reduced) return;

    var btn = document.createElement('button');
    btn.className = 'motion';
    btn.type = 'button';
    btn.innerHTML =
      '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' +
      '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M8 5l11 7-11 7z"/></svg>' +
      '<span class="motion__t"></span>';
    document.body.appendChild(btn);

    var label = btn.querySelector('.motion__t');

    /* No aria-pressed. The label already changes to name the next action,
       "Pause motion" becomes "Play motion", and a pressed state on top of
       that reads back as a contradiction: "Play motion on this page,
       pressed" at the exact moment motion has just stopped. A control
       whose label changes is not a toggle button. */
    function sync() {
      var off = root.classList.contains('is-paused');
      label.textContent = off ? 'Play motion' : 'Pause motion';
      btn.setAttribute('aria-label', off ? 'Play motion on this page' : 'Pause motion on this page');
    }

    btn.addEventListener('click', function () {
      var off = root.classList.toggle('is-paused');
      try { localStorage.setItem(KEY, off ? 'paused' : 'playing'); } catch (e) { /* blocked */ }
      vids.forEach(function (v) {
        if (off) v.pause();
        else { v.dataset.manual = ''; start(v); }
      });
      sync();
    });

    sync();

    /* For layouts that gate tiles on and off as the reader moves. */
    window.Live = {
      refresh: function () {
        vids.forEach(function (v) {
          if (wanted(v)) { if (v.dataset.manual !== 'off') start(v); }
          else v.pause();
        });
      }
    };
  });
})();
