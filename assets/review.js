/* ══════════════════════════════════════════════════════════
   Review layer
   Turn on Comment, click the thing you mean, type the note.
   Pins anchor to the element under the cursor and to a
   fraction of its box, so they survive reflow, theme swaps
   and a different window size. Copy hands back plain text.
   Review chrome only. Not part of the shipped site.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'rvw:' + location.pathname;
  var notes = [];
  var placing = false;
  var openId = null;
  var layer, bar, countEl, toggleEl, copyEl, clearEl, composer;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ── Storage ─────────────────────────────────── */
  var storageOk = true;

  function load() {
    try {
      localStorage.setItem('rvw:probe', '1');
      localStorage.removeItem('rvw:probe');
      notes = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      storageOk = false;
      notes = [];
    }
  }
  function save() {
    // Always keep an in-memory copy reachable, so notes can be recovered
    // from a live tab even when nothing can be written to disk.
    window.rvwNotes = notes;
    if (!storageOk) return;
    try { localStorage.setItem(KEY, JSON.stringify(notes)); }
    catch (e) { storageOk = false; warnStorage(); }
  }

  /* Serving the page over http keeps notes across a reload. Opened
     straight off disk, the browser refuses to store anything, so say
     so instead of losing the round of feedback quietly. */
  function warnStorage() {
    if (!bar || bar.querySelector('.rvw-warn')) return;
    var w = document.createElement('span');
    w.className = 'rvw-warn';
    w.textContent = 'not saving';
    w.title = 'This page was opened straight from disk, so the browser blocks storage. '
            + 'Comments survive until you reload. Serve the folder over http to keep them.';
    bar.insertBefore(w, bar.querySelector('[data-a="copy"]'));
  }

  /* ── Anchoring ───────────────────────────────────
     An index path from <body> plus a fraction of the target's
     own box. Re-resolving on every layout keeps a pin on its
     element instead of on a stale pixel. */
  function pathOf(el) {
    var parts = [];
    while (el && el !== document.body) {
      var parent = el.parentElement;
      if (!parent) return null;
      parts.unshift([].indexOf.call(parent.children, el));
      el = parent;
    }
    return el === document.body ? parts.join('.') : null;
  }

  function elFromPath(path) {
    var el = document.body;
    if (path === '') return el;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      el = el.children[+parts[i]];
      if (!el) return null;
    }
    return el;
  }

  /* A name a human recognises: the element's first class, plus
     whatever text it is carrying, trimmed to a glance. */
  function firstClass(el) {
    var c = el.getAttribute && el.getAttribute('class');
    return c && c.trim() ? c.trim().split(/\s+/)[0] : '';
  }

  function labelFor(el) {
    var node = el, hops = 0, owner = null, cls = '';
    while (node && node !== document.body && hops < 4) {
      cls = firstClass(node);
      if (cls) { owner = node; break; }
      node = node.parentElement; hops++;
    }
    if (!cls) cls = el.tagName.toLowerCase();

    // Four identical thumbnails would all read "ph__r". The repeat is
    // never on the clicked span itself, so climb to the nearest ancestor
    // that has same-class siblings and number that instead.
    var group = owner || el, hop = 0;
    while (group && group !== document.body && group.parentElement && hop < 6) {
      var gc = firstClass(group);
      if (gc) {
        var kin = [].filter.call(group.parentElement.children, function (s) {
          return firstClass(s) === gc;
        });
        if (kin.length > 1) { cls += ' #' + ([].indexOf.call(kin, group) + 1); break; }
      }
      group = group.parentElement; hop++;
    }

    var text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 46);
    return text ? cls + ' "' + text + '"' : cls;
  }

  /* ── Layer and pins ──────────────────────────── */
  function place() {
    var pins = layer.querySelectorAll('.rvw-pin');
    for (var i = 0; i < pins.length; i++) {
      var n = notes[+pins[i].dataset.i];
      if (!n) continue;
      var el = elFromPath(n.path);
      var r = el ? el.getBoundingClientRect() : null;
      if (!r || (!r.width && !r.height)) {
        // Anchor is gone or hidden (a swapped frame, a collapsed
        // panel). Park the pin at its recorded page position.
        pins[i].style.left = n.px + 'px';
        pins[i].style.top = n.py + 'px';
        continue;
      }
      pins[i].style.left = (r.left + window.scrollX + n.rx * r.width) + 'px';
      pins[i].style.top = (r.top + window.scrollY + n.ry * r.height) + 'px';
    }
    if (composer && openId !== null) positionComposer();
  }

  function render() {
    var pins = layer.querySelectorAll('.rvw-pin');
    for (var i = 0; i < pins.length; i++) pins[i].remove();

    notes.forEach(function (n, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rvw-pin' + (n.id === openId ? ' is-on is-open' : '');
      b.dataset.i = i;
      b.textContent = i + 1;
      b.title = n.text || 'Empty note';
      b.setAttribute('aria-label', 'Comment ' + (i + 1) + ': ' + (n.text || 'empty'));
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openNote(n.id);
      });
      layer.appendChild(b);
    });

    countEl.textContent = notes.length;
    copyEl.disabled = clearEl.disabled = notes.length === 0;
    place();
  }

  /* ── Composer ────────────────────────────────── */
  function positionComposer() {
    var pin = layer.querySelector('.rvw-pin.is-open');
    if (!pin || !composer) return;
    var px = parseFloat(pin.style.left) || 0;
    var py = parseFloat(pin.style.top) || 0;
    var w = composer.offsetWidth, h = composer.offsetHeight;
    var maxL = window.scrollX + document.documentElement.clientWidth - w - 12;
    var minL = window.scrollX + 12;
    var left = Math.min(Math.max(px + 22, minL), Math.max(minL, maxL));
    var top = py + 22;
    // Flip above the pin when the note would run off the bottom.
    if (top + h > window.scrollY + window.innerHeight - 12) top = py - h - 22;
    composer.style.left = left + 'px';
    composer.style.top = Math.max(window.scrollY + 12, top) + 'px';
  }

  function closeNote(discardEmpty) {
    if (composer) { composer.remove(); composer = null; }
    if (discardEmpty) {
      notes = notes.filter(function (n) { return (n.text || '').trim() !== ''; });
      save();
    }
    openId = null;
    render();
  }

  function openNote(id) {
    if (composer) closeNote(true);
    openId = id;
    render();

    var n = notes.filter(function (x) { return x.id === id; })[0];
    if (!n) { openId = null; return; }

    composer = document.createElement('div');
    composer.className = 'rvw-note';
    composer.innerHTML =
      '<div class="rvw-note__at"></div>' +
      '<textarea placeholder="What should change here?"></textarea>' +
      '<div class="rvw-note__row">' +
        '<button type="button" class="rvw-b rvw-b--go" data-a="save">Save</button>' +
        '<button type="button" class="rvw-b" data-a="cancel">Cancel</button>' +
        '<button type="button" class="rvw-b rvw-note__sp" data-a="del">Delete</button>' +
      '</div>';
    composer.querySelector('.rvw-note__at').textContent = n.at;
    var ta = composer.querySelector('textarea');
    ta.value = n.text || '';
    composer.addEventListener('click', function (e) { e.stopPropagation(); });

    composer.querySelector('[data-a="save"]').addEventListener('click', function () {
      n.text = ta.value.trim();
      save();
      closeNote(true);
    });
    composer.querySelector('[data-a="cancel"]').addEventListener('click', function () {
      closeNote(true);
    });
    composer.querySelector('[data-a="del"]').addEventListener('click', function () {
      notes = notes.filter(function (x) { return x.id !== id; });
      save();
      closeNote(false);
    });
    // Cmd/Ctrl+Enter saves without reaching for the mouse.
    ta.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        n.text = ta.value.trim(); save(); closeNote(true);
      }
    });

    layer.appendChild(composer);
    positionComposer();
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  /* ── Placing ─────────────────────────────────── */
  /* The page's own view controls stay live while pinning. Without
     them there is no way to reach frame 3 in order to comment on it. */
  var PASS = '.l6__btn, .l6__dot, .j6__thumb, .nav__theme, .dbar__a';

  function onDocClick(e) {
    if (!placing) return;
    if (e.target.closest('.rvw-bar, .rvw-note, .rvw-pin')) return;
    // Alt-click overrides the allowlist, so the controls themselves
    // can still be commented on.
    if (!e.altKey && e.target.closest(PASS)) { setTimeout(place, 420); return; }

    e.preventDefault();
    e.stopPropagation();

    var el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el.closest('.rvw-layer')) el = document.body;
    var path = pathOf(el);
    if (path === null) { el = document.body; path = ''; }

    var r = el.getBoundingClientRect();
    var n = {
      id: Date.now() + '.' + Math.random().toString(36).slice(2, 7),
      path: path,
      rx: r.width ? (e.clientX - r.left) / r.width : 0.5,
      ry: r.height ? (e.clientY - r.top) / r.height : 0.5,
      px: e.pageX,
      py: e.pageY,
      at: labelFor(el),
      text: ''
    };
    notes.push(n);
    save();
    openNote(n.id);
  }

  function setPlacing(on) {
    placing = on;
    document.documentElement.classList.toggle('rvw-on', on);
    toggleEl.classList.toggle('rvw-b--on', on);
    toggleEl.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggleEl.textContent = on ? 'Click to pin' : 'Comment';
  }

  /* ── Copy out ────────────────────────────────── */
  function asText() {
    var title = (document.title || location.pathname).replace(/\s*[·|]\s*/g, ' · ');
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var head = 'Comments on ' + location.pathname.replace(/^\//, '') + '\n' +
      title + '\n' +
      'Viewport ' + window.innerWidth + ' x ' + window.innerHeight + ' · ' + theme + ' theme\n\n';
    var body = notes.map(function (n, i) {
      return (i + 1) + '. ' + n.at + '\n   ' + (n.text || '(empty)').replace(/\n/g, '\n   ');
    }).join('\n\n');
    return head + body + '\n';
  }

  function flash(btn, word) {
    var was = btn.textContent;
    btn.textContent = word;
    setTimeout(function () { btn.textContent = was; }, 1400);
  }

  function copyOut() {
    var text = asText();
    var done = function () { flash(copyEl, 'Copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
    } else fallback(text, done);
  }

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-2000px;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { flash(copyEl, 'Copy failed'); }
    ta.remove();
  }

  /* ── Draggable toolbar ───────────────────────────
     J is exactly one viewport tall, so a bar fixed to a corner
     covers content that cannot be scrolled out from under it.
     Grab the handle and put it somewhere else. */
  function clampBar(l, t) {
    var w = bar.offsetWidth, h = bar.offsetHeight;
    return [
      Math.min(Math.max(8, l), Math.max(8, window.innerWidth - w - 8)),
      Math.min(Math.max(8, t), Math.max(8, window.innerHeight - h - 8))
    ];
  }

  function moveBar(l, t) {
    var p = clampBar(l, t);
    bar.style.left = p[0] + 'px';
    bar.style.top = p[1] + 'px';
    bar.style.right = 'auto';
    bar.style.bottom = 'auto';
    return p;
  }

  function setupDrag() {
    var grip = bar.querySelector('.rvw-grip');
    var from = null;

    try {
      var saved = JSON.parse(localStorage.getItem('rvw:bar'));
      if (saved) moveBar(saved[0], saved[1]);
    } catch (e) {}

    grip.addEventListener('pointerdown', function (e) {
      var r = bar.getBoundingClientRect();
      from = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      grip.setPointerCapture(e.pointerId);
      bar.classList.add('is-dragging');
      e.preventDefault();
    });

    grip.addEventListener('pointermove', function (e) {
      if (!from) return;
      moveBar(e.clientX - from.dx, e.clientY - from.dy);
    });

    grip.addEventListener('pointerup', function (e) {
      if (!from) return;
      from = null;
      bar.classList.remove('is-dragging');
      grip.releasePointerCapture(e.pointerId);
      var r = bar.getBoundingClientRect();
      try { localStorage.setItem('rvw:bar', JSON.stringify([r.left, r.top])); } catch (err) {}
    });

    // Keep it on screen when the window changes size.
    window.addEventListener('resize', function () {
      if (bar.style.left) moveBar(parseFloat(bar.style.left), parseFloat(bar.style.top));
    });
  }

  /* ── Boot ────────────────────────────────────── */
  ready(function () {
    load();

    layer = document.createElement('div');
    layer.className = 'rvw-layer';
    document.body.appendChild(layer);

    bar = document.createElement('div');
    bar.className = 'rvw-bar';
    bar.innerHTML =
      '<span class="rvw-grip" title="Drag to move this bar" aria-hidden="true"></span>' +
      '<button type="button" class="rvw-b" data-a="toggle" aria-pressed="false">Comment</button>' +
      '<span class="rvw-count">0</span>' +
      '<button type="button" class="rvw-b" data-a="copy">Copy</button>' +
      '<button type="button" class="rvw-b" data-a="clear">Clear</button>';
    document.body.appendChild(bar);

    toggleEl = bar.querySelector('[data-a="toggle"]');
    copyEl = bar.querySelector('[data-a="copy"]');
    clearEl = bar.querySelector('[data-a="clear"]');
    countEl = bar.querySelector('.rvw-count');

    setupDrag();

    toggleEl.addEventListener('click', function () { setPlacing(!placing); });
    copyEl.addEventListener('click', copyOut);
    clearEl.addEventListener('click', function () {
      if (!notes.length) return;
      if (!confirm('Delete all ' + notes.length + ' comments on this page?')) return;
      notes = [];
      save();
      closeNote(false);
      flash(clearEl, 'Cleared');
    });

    // Capture phase, so a click lands as a pin instead of following
    // a link or paging the deck while comment mode is on.
    document.addEventListener('click', onDocClick, true);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (composer) closeNote(true);
      else if (placing) setPlacing(false);
    });

    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(place);
      ro.observe(document.body);
      layer._ro = ro;   // hold the reference, an unheld observer is collected
    }

    if (!storageOk) warnStorage();
    window.rvwNotes = notes;
    render();
  });
})();
