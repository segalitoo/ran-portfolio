/* ══════════════════════════════════════════════════════════
   Ran Segal · shared behaviour
   Theme, scroll reveal, lightbox, video fallback, nav state.
   Loaded by the overview and every page in /work.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ══ THEME ══
     Applied as early as this file runs so the page does not flash light
     before switching to dark. */
  try {
    var saved = localStorage.getItem('v2-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked */ }

  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {

    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('v2-theme', next); } catch (e) { /* storage blocked */ }
      });
    }

    /* ══ VIDEO FALLBACK ══
       Each tool page has a video slot. Until the mp4 exists the poster
       carries it, so a missing file never shows a broken player. */
    Array.prototype.forEach.call(document.querySelectorAll('video[data-poster]'), function (vid) {
      function toPoster() {
        var frame = vid.parentElement;
        if (!frame) return;
        var badge = frame.querySelector('.stage__badge') ||
          (frame.parentElement && frame.parentElement.querySelector('.stage__badge'));
        var img = document.createElement('img');
        img.src = vid.getAttribute('data-poster');
        img.alt = vid.getAttribute('aria-label') || '';
        img.decoding = 'async';
        frame.innerHTML = '';
        frame.appendChild(img);
        frame.classList.add('is-loaded');
        if (badge) badge.remove();
      }
      vid.addEventListener('error', toPoster, { once: true });
      /* A missing file 404s fast, often before DOMContentLoaded, so the
         listener above can be bound too late to ever hear it. Checking
         the error that already happened is what actually catches an
         empty slot: without this the page keeps a "Recording" badge
         over a still, which claims something that is not true. */
      if (vid.error) toPoster();
    });

    /* ══ IMAGE LOAD ══
       Release the placeholder ratio once the real dimensions are known. */
    Array.prototype.forEach.call(document.querySelectorAll('.stage__frame img, .note__shot img, .card__shot img'), function (im) {
      var done = function () {
        if (im.parentElement) im.parentElement.classList.add('is-loaded');
      };
      if (im.complete && im.naturalWidth) done();
      else im.addEventListener('load', done, { once: true });
    });

    /* ══ REVEAL ══
       IntersectionObserver on its own loses anything an instant jump skips
       past (anchor click, restored scroll, keyboard paging), leaving it
       invisible for good. The sweep is the safety net. */
    var sweep = function () { };
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      Array.prototype.forEach.call(document.querySelectorAll('.rv'), function (n) {
        n.classList.add('is-in');
      });
    } else {
      var pending = new Set(document.querySelectorAll('.rv'));
      var seen = new WeakMap();

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) show(en.target, true); });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

      function show(n, stagger) {
        if (!pending.has(n)) return;
        pending.delete(n);
        io.unobserve(n);
        if (stagger) {
          var p = n.parentElement;
          var i = seen.get(p) || 0;
          seen.set(p, i + 1);
          n.style.transitionDelay = Math.min(i, 5) * 65 + 'ms';
          /* The delay is inline and applies to every transitioned
             property, so left in place it would also delay this card's
             hover and press for the life of the page. */
          n.addEventListener('transitionend', function clear() {
            n.style.transitionDelay = '';
            n.removeEventListener('transitionend', clear);
          });
        }
        n.classList.add('is-in');
      }

      pending.forEach(function (n) { io.observe(n); });

      var raf = null;
      sweep = function () {
        if (!pending.size || raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var fold = window.innerHeight * 0.94;
          Array.prototype.slice.call(pending).forEach(function (n) {
            /* Staggered here too. The sweep exists to catch what the
               observer missed, but on load it fires first and claims
               everything above the fold, so passing false meant the
               first screen never staggered at all. */
            if (n.getBoundingClientRect().top < fold) show(n, true);
          });
        });
      };

      window.addEventListener('resize', sweep);
    }

    /* ══ NAV ══ */
    var nav = document.getElementById('nav');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__a[href^="#"]'));
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    var navRaf = null;

    function onScroll() {
      if (navRaf) return;
      navRaf = requestAnimationFrame(function () {
        navRaf = null;
        if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
        sweep();

        if (sections.length) {
          var current = -1;
          sections.forEach(function (s, i) {
            if (s.getBoundingClientRect().top <= 140) current = i;
          });
          navLinks.forEach(function (a, i) { a.classList.toggle('is-current', i === current); });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ══ SWAP STAGE ══
       The one authored moment on a project page: the frame beside the notes
       swaps to whichever note you have reached. Everything else holds still.
       Below the collapse breakpoint the stage is display:none and each note
       carries its own inline frame, so this observer simply finds nothing. */
    (function () {
      var proj = document.querySelector('.proj');
      if (!proj) return;
      var stage = proj.querySelector('.proj__stage');
      if (!stage) return;

      var notes = Array.prototype.slice.call(proj.querySelectorAll('.note[data-frame]'));
      var frames = Array.prototype.slice.call(stage.querySelectorAll('.stage__frame'));
      var caps = Array.prototype.slice.call(stage.querySelectorAll('.stage__cap'));
      if (!notes.length || !frames.length) return;

      var current = -1;

      function show(i) {
        if (i === current) return;
        current = i;
        frames.forEach(function (f, n) { f.classList.toggle('is-on', n === i); });
        caps.forEach(function (c, n) { c.classList.toggle('is-on', n === i); });
        notes.forEach(function (n) {
          n.classList.toggle('is-active', +n.dataset.frame === i);
        });
      }

      show(0);
      // Dimming only switches on once the pairing is actually driven, so a
      // no-JS or reduced-motion reader never gets a page of faded text.
      proj.classList.add('is-live');

      // Nearest note to a band a third of the way down the viewport. Reading
      // position, not first-intersection, or fast scrolling picks the wrong one.
      var raf = null;
      function pick() {
        raf = null;
        var line = window.innerHeight * 0.34;
        var best = 0, bestD = Infinity;
        for (var i = 0; i < notes.length; i++) {
          var r = notes[i].getBoundingClientRect();
          var d = Math.abs(r.top + r.height * 0.3 - line);
          if (d < bestD) { bestD = d; best = i; }
        }
        show(+notes[best].dataset.frame);
      }

      function onScroll() { if (!raf) raf = requestAnimationFrame(pick); }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      pick();
    })();

    /* ══ LIGHTBOX ══ */
    var lb = document.getElementById('lb');
    var lbImg = document.getElementById('lbImg');

    if (lb && lbImg) {
      document.addEventListener('click', function (e) {
        var img = e.target.closest('.stage__frame img, .note__shot img');
        if (img) {
          lbImg.src = img.currentSrc || img.src;
          lbImg.alt = img.alt || '';
          lb.classList.add('is-open');
          document.body.classList.add('is-locked');
          return;
        }
        if (e.target.closest('.lb__x') || e.target === lb) closeLb();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLb();
      });
    }

    function closeLb() {
      if (!lb) return;
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    }
  });
})();
