/* ══════════════════════════════════════════════════════════
   Hero field · magnet
   Dots ease out of the cursor's way and glide back. Tuned calm:
   a 4 to 10px swell on a 30px grid, no overshoot.

   Usage: <header class="hero" data-hero-field> ... </header>
   The canvas and glow are injected, so each design only needs the
   attribute plus hero-field.css.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  var SPACING = 30;   // grid pitch, css px
  var RADIUS = 175;  // how far the cursor reaches
  var DOT_R = 1.5;   // base dot radius
  var BASE_A = 0.34;  // base dot opacity

  /* Canvas needs literal colours, so read the tokens and parse them.
     Re-read whenever the theme flips or the dots keep the old palette. */
  var PAL = {};
  var themeWatch = null;

  function token(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var m = v.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    m = v.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : [120, 120, 120];
  }

  function readPalette() {
    PAL.ink = token('--text-primary');
    PAL.primary = token('--primary');
  }

  function css(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function Field(host) {
    var wrap = document.createElement('div');
    wrap.className = 'hfield';
    var cv = document.createElement('canvas');
    cv.className = 'hfield__c';
    var glow = document.createElement('div');
    glow.className = 'hfield__glow';
    wrap.appendChild(cv);
    wrap.appendChild(glow);
    host.insertBefore(wrap, host.firstChild);

    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1;
    var dots = [];
    var px = -9999, py = -9999;   // smoothed pointer
    var tx = -9999, ty = -9999;   // raw pointer target
    var inView = false, raf = null, idle = 0;

    function build() {
      dots = [];
      for (var y = SPACING / 2; y < H + SPACING; y += SPACING) {
        for (var x = SPACING / 2; x < W + SPACING; x += SPACING) {
          dots.push({ ox: x, oy: y, x: x, y: y, vx: 0, vy: 0 });
        }
      }
    }

    function resize() {
      var r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var moving = false;

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var dx = d.x - px, dy = d.y - py;
        var dist = Math.hypot(dx, dy);

        if (dist < RADIUS && dist > 0.01) {
          var push = 1 - dist / RADIUS;
          var f = push * push * 6;
          d.vx += (dx / dist) * f * 0.095;
          d.vy += (dy / dist) * f * 0.095;
        }

        // Soft spring, heavy friction. Near critical damping, so dots glide
        // home rather than springing past and bouncing.
        d.vx += (d.ox - d.x) * 0.024;
        d.vy += (d.oy - d.y) * 0.024;
        d.vx *= 0.78; d.vy *= 0.78;
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.vx) > 0.02 || Math.abs(d.vy) > 0.02) moving = true;

        var disp = Math.hypot(d.x - d.ox, d.y - d.oy);
        var hot = Math.min(disp / 5, 1);

        // Fade the field out toward the bottom so it never fights the content
        // sitting under the headline.
        var vf = 1 - Math.min(Math.max((d.y / H - 0.15) / 0.6, 0), 1);
        var a = BASE_A * (0.68 + hot * 0.45) * vf;
        if (a <= 0.004) continue;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_R * (1 + hot * 0.18), 0, 6.2832);
        ctx.fillStyle = css(hot > 0.5 ? PAL.primary : PAL.ink, Math.min(a, 0.85));
        ctx.fill();
      }

      return moving;
    }

    function loop() {
      raf = null;
      // Smooth the pointer so a fast flick glides instead of tearing.
      if (tx > -1000) {
        px += (tx - px) * 0.16;
        py += (ty - py) * 0.16;
      }
      var moving = draw();
      var settled = !moving && Math.abs(tx - px) < 0.4 && Math.abs(ty - py) < 0.4;
      idle = settled ? idle + 1 : 0;
      // Stop once nothing is changing. The next pointer move restarts it.
      if (inView && idle < 14) raf = requestAnimationFrame(loop);
    }

    function wake() {
      idle = 0;
      if (inView && !raf) raf = requestAnimationFrame(loop);
    }

    function onMove(e) {
      var r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (px < -1000) { px = tx; py = ty; }
      wake();
    }

    function onLeave() {
      tx = ty = px = py = -9999;
      wake();
    }

    if (canHover && !reduced) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
    }

    // Both observers are held on the instance. An observer created inline
    // with no reference can be collected, which silently kills the whole
    // field: no visibility callback, no resize, no animation loop.
    this.io = new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      if (inView) wake();
      else if (raf) { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0.01 });
    this.io.observe(host);

    this.ro = new ResizeObserver(function () { resize(); wake(); });
    this.ro.observe(host);

    resize();
    // Fonts settling changes the hero's height after first paint.
    window.addEventListener('load', function () { resize(); wake(); });

    this.repaint = function () { draw(); wake(); };
  }

  function init() {
    readPalette();
    var fields = [];
    Array.prototype.forEach.call(document.querySelectorAll('[data-hero-field]'), function (el) {
      fields.push(new Field(el));
    });
    if (!fields.length) return;

    // Each design owns its own theme toggle, so watch the attribute rather
    // than trying to hook a button this file does not know about.
    themeWatch = new MutationObserver(function () {
      readPalette();
      fields.forEach(function (f) { f.repaint(); });
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      readPalette();
      fields.forEach(function (f) { f.repaint(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
