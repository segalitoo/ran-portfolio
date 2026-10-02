/* ══════════════════════════════════════════════════════════
   Spec ads through a pipeline · page behaviour
   Opening the lightbox and the chapter rail, the same way
   bingo-bay.js does them. site.js owns closing the lightbox.
   Loops pause when reduced motion is asked for.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');

  document.addEventListener('click', function (e) {
    var img = e.target.closest('.bb-fig__f img, .as-set img, .as-ly img');
    if (!img || !lb || !lbImg) return;
    lbImg.src = img.getAttribute('data-full') || img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    if (lbCap) lbCap.innerHTML = '';
    lb.classList.add('is-open');
    document.body.classList.add('is-locked');
  });

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.as-loops video'), function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.setAttribute('controls', '');
    });
  }

  /* ══ Chapter rail ══ */
  var rail = document.getElementById('bbRail');
  if (rail) {
    var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
    var chapters = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var raf = null, on = -1;

    function pick() {
      raf = null;
      var line = window.innerHeight * 0.34, cur = 0;
      chapters.forEach(function (c, i) { if (c && c.getBoundingClientRect().top <= line) cur = i; });
      if (cur === on) return;
      on = cur;
      links.forEach(function (a, i) {
        a.classList.toggle('is-on', i === cur);
        if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      var ol = links[cur].parentElement.parentElement;
      if (ol.scrollWidth > ol.clientWidth) {
        var l = links[cur].offsetLeft - ol.clientWidth / 2 + links[cur].offsetWidth / 2;
        ol.scrollTo({ left: l, behavior: 'smooth' });
      }
    }

    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(pick); }, { passive: true });
    window.addEventListener('resize', function () { if (!raf) raf = requestAnimationFrame(pick); });
    pick();
  }
})();
