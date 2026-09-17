/* Round-6 inner-page behaviour. Throwaway alongside inner-v6.css. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {

    /* ══ J · thumbnails swap the main frame ══ */
    var stage = document.querySelector('.j6__stage');
    if (stage) {
      var mains = [].slice.call(stage.querySelectorAll('.j6__main > *'));
      var thumbs = [].slice.call(stage.querySelectorAll('.j6__thumb'));

      function pick(i) {
        mains.forEach(function (m, n) { m.hidden = n !== i; });
        thumbs.forEach(function (t, n) {
          t.classList.toggle('is-on', n === i);
          t.setAttribute('aria-pressed', n === i ? 'true' : 'false');
        });
      }

      thumbs.forEach(function (t, i) {
        t.addEventListener('click', function () { pick(i); });
      });
      pick(0);
    }

    /* ══ L · paged deck ══
       Four frames without a single line of scrolling. Arrows, dots
       and the keyboard all drive the same index. */
    var deck = document.querySelector('.l6__deck');
    if (!deck) return;

    var frames = [].slice.call(deck.querySelectorAll('.l6__frame'));
    var slides = [].slice.call(document.querySelectorAll('.l6__slide'));
    var dots = [].slice.call(document.querySelectorAll('.l6__dot'));
    var count = document.querySelector('.l6__count');
    var at = 0;

    function go(i) {
      at = (i + frames.length) % frames.length;
      frames.forEach(function (f, n) { f.classList.toggle('is-on', n === at); });
      slides.forEach(function (s, n) { s.classList.toggle('is-on', n === at); });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-on', n === at);
        d.setAttribute('aria-current', n === at ? 'true' : 'false');
      });
      if (count) count.textContent = (at + 1) + ' / ' + frames.length;
    }

    var prev = document.querySelector('[data-deck="prev"]');
    var next = document.querySelector('[data-deck="next"]');
    if (prev) prev.addEventListener('click', function () { go(at - 1); });
    if (next) next.addEventListener('click', function () { go(at + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });

    // Arrow keys, unless the reader is typing into something.
    document.addEventListener('keydown', function (e) {
      var t = e.target.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'ArrowLeft') { go(at - 1); }
      else if (e.key === 'ArrowRight') { go(at + 1); }
    });

    go(0);
  });
})();
