/* Round-5 inner-page behaviour. Throwaway alongside inner-v5.css. */
(function () {
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {

    /* ══ REVEAL ══
       Frames wipe open, text lifts. Staggered 60ms between siblings,
       short enough that the page never feels held up. */
    var targets = [].slice.call(document.querySelectorAll('.rv5, .rvt'));

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (n) { n.classList.add('is-in'); });
    } else {
      var seen = new WeakMap();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var n = en.target, p = n.parentElement;
          var i = seen.get(p) || 0;
          seen.set(p, i + 1);
          n.style.transitionDelay = Math.min(i, 4) * 60 + 'ms';
          n.classList.add('is-in');
          io.unobserve(n);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      targets.forEach(function (n) { io.observe(n); });

      // Anything already above the fold on load, or skipped by an instant
      // jump, would otherwise stay clipped forever.
      var sweep = function () {
        var fold = window.innerHeight * 0.95;
        targets.forEach(function (n) {
          if (!n.classList.contains('is-in') && n.getBoundingClientRect().top < fold) {
            n.classList.add('is-in');
            io.unobserve(n);
          }
        });
      };
      window.addEventListener('scroll', sweep, { passive: true });
      window.addEventListener('load', sweep);
      sweep();
    }

    /* ══ INDEX · marker and legend pairing ══
       Hovering either the marker on the picture or its entry in the
       legend lights both, so the reader can see which is which. */
    var marks = [].slice.call(document.querySelectorAll('.i5-mark'));
    var items = [].slice.call(document.querySelectorAll('.i5-item'));

    if (marks.length && items.length) {
      var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

      function light(n, on) {
        marks.forEach(function (m) { if (m.dataset.n === n) m.classList.toggle('is-lit', on); });
        items.forEach(function (it) { if (it.dataset.n === n) it.classList.toggle('is-lit', on); });
      }

      if (fine) {
        marks.concat(items).forEach(function (el) {
          el.addEventListener('mouseenter', function () { light(el.dataset.n, true); });
          el.addEventListener('mouseleave', function () { light(el.dataset.n, false); });
        });
      }

      // Touch and keyboard get the pairing too: focus lights the pair.
      items.forEach(function (it) {
        it.setAttribute('tabindex', '0');
        it.addEventListener('focus', function () { light(it.dataset.n, true); });
        it.addEventListener('blur', function () { light(it.dataset.n, false); });
      });
    }
  });
})();
