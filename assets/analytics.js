/* ══════════════════════════════════════════════════════════
   Analytics
   Page views, clicks on anything worth counting, and how far
   people read. Town and country come from the provider's own
   IP lookup, so there is nothing to collect for them here.

   Two providers, one gate. GA4 answers how many and from where.
   Clarity answers what they actually did: session replays, click
   heatmaps, rage clicks and dead clicks. Either id can be empty
   and the other still works; both empty makes every call here a
   no-op, so the page ships safely rather than half-wired.

   One opt-out covers both, because a recording of my own visits
   is worse than a pageview of them.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Recovered from fc18cf1. The rewrite in fd8afab swapped the inline
     gtag snippet for this file and left the id blank, so the commit
     that said it shipped analytics is the one that switched them off. */
  var MEASUREMENT_ID = 'G-7BQQ79P7QM';

  /* From clarity.microsoft.com: Settings, Overview, the project id.
     Ten characters, lowercase. Empty means Clarity stays off and GA4
     carries on alone. */
  var CLARITY_ID = 'yzjj8g6e8n';

  var KEY = 'ran-no-analytics';

  /* My own visits would otherwise be a meaningful share of a portfolio's
     traffic. Loading any page with ?analytics=off writes a flag that
     stays in that browser until ?analytics=on clears it, so each browser
     and device I use has to be told once. */
  function self() {
    try {
      if (/[?&]analytics=off(&|$)/.test(location.search)) {
        localStorage.setItem(KEY, '1');
        console.log('Analytics off in this browser. Visit ?analytics=on to undo.');
      } else if (/[?&]analytics=on(&|$)/.test(location.search)) {
        localStorage.removeItem(KEY);
        console.log('Analytics on in this browser.');
      }
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  /* A dev server is me by definition, so it never counts. */
  function local() {
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '::1' ||
           h === '' || /\.local$/.test(h);
  }

  /* Honour an explicit opt-out. A portfolio is not worth
     overriding someone's stated preference for. */
  var optedOut = navigator.doNotTrack === '1' ||
                 window.doNotTrack === '1' ||
                 navigator.msDoNotTrack === '1';

  /* Called before the test, not inside it: || is lazy, and the flag has
     to be writable from a dev server too, where local() is already true. */
  var excluded = self();

  if (optedOut || local() || excluded || (!MEASUREMENT_ID && !CLARITY_ID)) {
    /* Belt and braces: if anything else on the page loads gtag, this
       tells GA to drop the hits for this property anyway. */
    window['ga-disable-' + MEASUREMENT_ID] = true;
    window.track = function () {};
    return;
  }

  function load(src) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = src;
    document.head.appendChild(tag);
  }

  /* ── GA4 ───────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  if (MEASUREMENT_ID) {
    load('https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID);
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, {
      page_title: document.title,
      page_path: location.pathname + location.search
    });
  }

  /* ── Clarity ───────────────────────────────────── */
  if (CLARITY_ID) {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    load('https://www.clarity.ms/tag/' + CLARITY_ID);
    /* Replays are only worth watching if you can find the right ones,
       so every session is tagged with the page it started on. */
    window.clarity('set', 'entry_page', location.pathname.split('/').pop() || 'index.html');
  }

  /* One call, both providers. Clarity takes a bare name, so the params
     that GA4 gets are flattened into a single readable tag value. */
  function track(name, params) {
    params = params || {};
    if (MEASUREMENT_ID) gtag('event', name, params);
    if (CLARITY_ID && window.clarity) {
      window.clarity('event', name);
      if (params.label) window.clarity('set', name, String(params.label).slice(0, 100));
    }
  }
  window.track = track;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var page = location.pathname.split('/').pop() || 'index.html';

    /* ── Clicks ──────────────────────────────────────
       One delegated listener. Each entry names what was hit and
       pulls a label from the element, so a new button on a new
       page is counted without touching this file. */
    var MAP = [
      ['.f-btn',            'cta_click'],
      ['.f-card__t a',      'project_open'],
      ['.btn',              'cta_click'],
      ['.pg-next a',        'next_project'],
      ['.pg-back',          'back_to_work'],
      ['.nav__a',           'nav_click'],
      ['.nav__theme',       'theme_toggle'],
      ['.o-contact__v a',   'contact_click'],
      ['.f-more__btn',      'more_projects'],
      ['.pg-gal__i img',    'gallery_open'],
      ['.f-frame img',      'project_open']
    ];

    document.addEventListener('click', function (e) {
      for (var i = 0; i < MAP.length; i++) {
        var el = e.target.closest(MAP[i][0]);
        if (!el) continue;

        var href = el.getAttribute('href') || (el.closest('a') && el.closest('a').getAttribute('href')) || '';
        var label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('alt') || '')
                      .replace(/\s+/g, ' ').trim().slice(0, 80);

        track(MAP[i][1], { page: page, label: label, target: href });

        /* A link leaving the site is worth knowing separately. */
        if (/^https?:/.test(href) && href.indexOf(location.host) === -1) {
          track('outbound', { page: page, target: href, label: label });
        }
        return;
      }
    }, true);

    /* ── Read depth ──────────────────────────────────
       Whether anyone reaches the work is the question a portfolio
       actually wants answered. Each mark fires once. */
    var marks = [25, 50, 75, 100], hit = {};
    var ticking = false;

    function depth() {
      ticking = false;
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < 200) return;
      var pct = Math.round((window.scrollY / scrollable) * 100);
      for (var i = 0; i < marks.length; i++) {
        if (pct >= marks[i] && !hit[marks[i]]) {
          hit[marks[i]] = true;
          track('read_depth', { page: page, percent: marks[i] });
        }
      }
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(depth);
    }, { passive: true });
  });
})();
