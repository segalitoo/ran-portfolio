/* ══════════════════════════════════════════════════════════
   Analytics
   Page views, clicks on anything worth counting, and how far
   people read. Town and country come from the provider's own
   IP lookup, so there is nothing to collect for them here.

   Set MEASUREMENT_ID below to switch it on. Empty means every
   call in this file is a no-op, so the page ships safely with
   analytics dormant rather than half-wired.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MEASUREMENT_ID = '';           // e.g. 'G-XXXXXXXXXX'

  /* Honour an explicit opt-out. A portfolio is not worth
     overriding someone's stated preference for. */
  var optedOut = navigator.doNotTrack === '1' ||
                 window.doNotTrack === '1' ||
                 navigator.msDoNotTrack === '1';

  if (!MEASUREMENT_ID || optedOut) {
    window.track = function () {};
    return;
  }

  /* ── Loader ────────────────────────────────────── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(tag);

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    page_title: document.title,
    page_path: location.pathname + location.search
  });

  function track(name, params) {
    gtag('event', name, params || {});
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
