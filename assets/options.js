/* Option-page behaviour. The D page repeats the j6 stage nine times,
   so the thumbnail swap has to work per stage rather than once. */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var stages = [].slice.call(document.querySelectorAll('.j6__stage'));

    stages.forEach(function (stage) {
      var mains = [].slice.call(stage.querySelectorAll('.j6__main > *'));
      var thumbs = [].slice.call(stage.querySelectorAll('.j6__thumb'));
      if (!mains.length || !thumbs.length) return;

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
    });
  });
})();
