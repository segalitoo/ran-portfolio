/* ══════════════════════════════════════════════════════════
   Bingo Bay · page behaviour
   Swatches that copy, the 55-frame contact sheet, the soundtrack
   player, the nine workflow stages and the chapter rail. Ported
   from the take-home, where it all ran inline; the data is the
   same data, the rejection notes are the reasons given at the time.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var SHEET = '../images/bingo-bay/sheet/';

  function copy(text) {
    try { return navigator.clipboard.writeText(text); } catch (e) { return Promise.reject(e); }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ══ Palette ══ */
  var PALETTE = [
    ['Sunset Gold', '#FFC24B'], ['Amber Glow', '#FF9E45'], ['Coral Sunset', '#FF6F61'], ['Rose Dusk', '#FF5C7A'],
    ['Tropical Teal', '#1FB8A6'], ['Dusk Purple', '#3A2A5C'], ['Warm Sand', '#F3D9A4'], ['Cream Light', '#FFF4E2']
  ];

  var sw = document.getElementById('bbSwatches');
  if (sw) {
    PALETTE.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bb-sw__i';
      b.setAttribute('aria-label', 'Copy ' + p[0] + ' ' + p[1]);
      b.innerHTML = '<span class="bb-sw__c" style="background:' + p[1] + '"></span>' +
        '<span class="bb-sw__n">' + p[0] + '<span class="bb-sw__h">' + p[1] + '</span></span>';
      b.addEventListener('click', function () {
        var h = b.querySelector('.bb-sw__h');
        copy(p[1]).catch(function () {});
        h.textContent = 'Copied';
        b.classList.add('is-copied');
        setTimeout(function () { h.textContent = p[1]; b.classList.remove('is-copied'); }, 1000);
      });
      sw.appendChild(b);
    });
  }

  /* ══ Copy buttons on prompts ══ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.getAttribute('data-copy'));
      if (!src) return;
      copy(src.innerText.replace(/\s*Copy\s*$/, '').trim()).catch(function () {});
      btn.textContent = 'Copied';
      btn.classList.add('is-done');
      setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1400);
    });
  });

  /* ══ Lightbox, with an optional note under the picture ══
     site.js owns closing it. Opening is done here because site.js only
     knows its own frame classes. */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');

  function openLb(src, alt, note) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || '';
    if (lbCap) lbCap.innerHTML = note || '';
    lb.classList.add('is-open');
    document.body.classList.add('is-locked');
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('.bb-fig__f img');
    if (img) openLb(img.getAttribute('data-full') || img.currentSrc || img.src, img.alt);
  });

  /* ══ Contact sheet ══ */
  var PET = function (c) {
    return 'Cute collectible sea-creature character, glossy stylized 3D render, Pixar-like casual mobile game asset. [CHARACTER: ' + c + ']. Big expressive friendly eyes, soft rounded shapes, glossy highlights, subsurface scattering, warm golden-hour lighting, subtle rim light. Centered, full body, clean neutral soft-gradient background for easy cutout, consistent character style, premium mobile game quality, high detail.';
  };

  var FAMILIES = [
    { name: 'Coral', what: 'crab', prefix: 'crab', count: 8, kept: 2,
      slot: 'a cheerful orange crab with raised claws and a tiny flower lei',
      keptNote: 'Claws-up pose reads at icon size, the warmest smile, brown eyes with big catchlights, the cleanest vinyl-toy gloss on the shell.',
      notes: { 1: 'Blue eyes break the cast’s brown-eye rule.', 3: 'Grey, muted background and flatter light.', 4: 'Raised eyestalks, a different anatomy from the rest of the set.', 5: 'Blue eyes on a near-white background.', 6: 'Floating mid-air, pinkish background.', 7: 'Eyestalks again, so the anatomy does not match the set.', 8: 'Blue eyes on a cool blue background.' } },
    { name: 'Shelly', what: 'turtle', prefix: 'turtle', count: 8, kept: 4,
      slot: 'a calm green sea turtle wearing a tropical flower lei',
      keptNote: 'The lei reads clearly, a calm warm expression, shell gloss that matches the set, and a grounded three-quarter pose.',
      notes: { 1: 'Standing on a pedestal prop, cool blue background.', 2: 'Blue-tinted background, off the warm palette.', 3: 'Reads as ceramic rather than the set’s vinyl.', 5: 'Blue-green background, waving side-on.', 6: 'Sand pedestal prop and a side profile.', 7: 'Half-lidded, sleepy eyes. Wrong mood for a collectible.', 8: 'Cooler grey background, chunkier build, a gold-outlined shell nobody else has.' } },
    { name: 'Twinkle', what: 'starfish', prefix: 'starfish', count: 12, kept: 12,
      slot: 'a sparkly pink starfish with big eyes and a subtle glitter shimmer',
      keptNote: 'Twelve rounds to land: a clean five-point silhouette, the warm studio gradient, brown eyes, sparkle without clutter. Retouched in the final consistency pass.',
      notes: { 1: 'Cool lavender-grey background, off the warm palette.', 2: 'Lavender background and a softer, mushier render.', 3: 'Lavender background, flat lighting.', 4: 'The leaning pose weakens the star silhouette.', 5: 'Orange bokeh breaks the clean studio look.', 6: 'An elongated blob. The five points are gone.', 7: 'Olive-green iris breaks the brown-eye rule.', 8: 'Blurry sunset bokeh, a different depth treatment.', 9: 'A real sky instead of the studio gradient.', 10: 'Strong backlight, lit differently from the set.', 11: 'Purple-pink cast and flat frontal light.' } },
    { name: 'Splash', what: 'dolphin', prefix: 'dolphin', count: 8, kept: 7,
      slot: 'a playful teal dolphin mid-jump with sparkling water drops',
      keptNote: 'The mid-jump arc gives the collection its movement, the friendliest eye, and water drops that catch the rim light. Regraded into golden-hour warmth in the consistency pass.',
      notes: { 1: 'Orange life-vest prop, cool grey background.', 2: 'Cool blue-grey background, flat shadow floor.', 3: 'Strong runner-up. The background is paler and cooler than the set.', 4: 'A photographic sunset sky instead of the studio gradient.', 5: 'Oversaturated orange-purple duotone.', 6: 'Cool blue background, heavier splash.', 8: 'Right eye colour, but a medal, an armband and a mint background break the set.' } },
    { name: 'Mango', what: 'host', prefix: 'mango', count: 9, kept: 9,
      slot: 'a joyful toucan festival host with a flower lei, one wing raised in welcome',
      keptNote: 'Host energy: open beak, a welcoming wing, feet on the ground. Two retouch passes after the Bria cutout to clean the edges and match the light.',
      notes: { 1: 'Flat grey-white background, cooler light, a flatter render.', 2: 'Perched on a branch, a prop no other character has.', 3: 'A good render in a calmer pose. Less energy than the cast.', 4: 'A wink breaks the open brown-eye rule.', 5: 'Flying, eyes closed, feet off the ground.', 6: 'Cream background, closed beak, subdued.', 7: 'Stiffer pose, closed beak, cooler background.', 8: 'A calm raised wing, less expressive than the keeper.' } },
    { name: 'Scenes', what: 'plates', prefix: 'scene', count: 10, kept: 2,
      slot: 'background plate: festival bay, no characters, no text',
      prompt: 'Mobile game UI background, glossy stylized 3D casual game, summer beach festival at golden-hour sunset, tropical bay with sparkling turquoise water, warm amber sky, paper lanterns and bunting, soft depth of field, no characters, no text, clean composition with clear central space for UI panels, premium casual mobile game art.',
      keptNote: 'The only background rendered in the cast’s modelled-3D style. Peach sky, teal water and bunting repeat the character palette, with clear space in the middle for UI.',
      notes: { 1: 'Darker red sky, an empty stage, a flatter render.', 3: 'Too empty and washed out in the middle.', 4: 'Painterly 2D, against a 3D cast.', 5: 'A lighthouse and a bar. Busier, and a different place.', 6: 'Characters baked in, so it cannot be reused as a plate.', 7: 'Flatter, closer to 2D.', 8: 'Key art with a logo baked in. Not a background.', 9: 'Soft and painterly, less 3D.', 10: 'A painterly wide lagoon. Wrong style for the cast.' } }
  ];

  var tabs = document.getElementById('bbTabs');
  var sheet = document.getElementById('bbSheet');
  var slot = document.getElementById('bbSlot');
  var full = document.getElementById('bbFull');
  var fullText = document.getElementById('bbFullText');
  var toggle = document.getElementById('bbToggle');
  var pop = document.createElement('div');
  pop.className = 'bb-pop';
  pop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pop);

  function note(f, i) {
    var kept = i === f.kept;
    var n = f.prefix + '_' + String(i).padStart(2, '0');
    return '<div class="bb-note__h"><span class="bb-note__n">' + n + '</span>' +
      '<span class="bb-note__s' + (kept ? ' is-kept' : '') + '">' + (kept ? 'Kept' : 'Not kept') + '</span></div>' +
      '<p class="bb-note__d">' + esc(kept ? f.keptNote : (f.notes[i] || '')) + '</p>';
  }

  function showPop(f, i, x, y) {
    pop.innerHTML = note(f, i);
    pop.classList.add('is-on');
    var w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.min(x + 16, window.innerWidth - w - 12) + 'px';
    pop.style.top = Math.min(y + 16, window.innerHeight - h - 12) + 'px';
  }

  function hidePop() { pop.classList.remove('is-on'); }

  var active = 0;
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function renderSheet() {
    var f = FAMILIES[active];
    sheet.innerHTML = '';
    slot.textContent = '[' + f.slot + ']';
    fullText.textContent = f.prompt || PET(f.slot);
    full.hidden = true;
    toggle.textContent = 'Show the full prompt';
    toggle.setAttribute('aria-expanded', 'false');

    for (var i = 1; i <= f.count; i++) {
      (function (i) {
        var nn = String(i).padStart(2, '0');
        var kept = i === f.kept;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'bb-cell' + (kept ? ' is-kept' : '');
        b.setAttribute('aria-label', f.name + ' ' + f.what + ', version ' + i + (kept ? ', kept' : ', not kept'));
        b.innerHTML = '<img src="' + SHEET + f.prefix + '_' + nn + '-s.webp" alt="" loading="lazy" decoding="async" width="360" height="480">' +
          '<span class="bb-cell__v">v' + nn + '</span>';
        b.addEventListener('click', function () {
          hidePop();
          openLb(SHEET + f.prefix + '_' + nn + '-l.webp', f.name + ' version ' + i, note(f, i));
        });
        if (hover) {
          b.addEventListener('mousemove', function (e) { showPop(f, i, e.clientX, e.clientY); });
          b.addEventListener('mouseleave', hidePop);
        }
        sheet.appendChild(b);
      })(i);
    }
  }

  if (tabs && sheet) {
    FAMILIES.forEach(function (f, n) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'bb-tab';
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', n === active ? 'true' : 'false');
      t.innerHTML = f.name + ' <span>' + f.count + '</span>';
      t.addEventListener('click', function () {
        active = n;
        Array.prototype.forEach.call(tabs.children, function (c, k) { c.setAttribute('aria-selected', k === n ? 'true' : 'false'); });
        renderSheet();
      });
      tabs.appendChild(t);
    });

    toggle.addEventListener('click', function () {
      full.hidden = !full.hidden;
      toggle.textContent = full.hidden ? 'Show the full prompt' : 'Hide the full prompt';
      toggle.setAttribute('aria-expanded', full.hidden ? 'false' : 'true');
    });

    window.addEventListener('scroll', hidePop, { passive: true });
    renderSheet();
  }

  /* ══ Soundtrack ══ */
  var audio = document.getElementById('bbAudio');
  var play = document.getElementById('bbPlay');
  var seek = document.getElementById('bbSeek');
  var cur = document.getElementById('bbCur');
  var dur = document.getElementById('bbDur');

  function t(s) {
    if (!isFinite(s)) return '0:00';
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + String(r).padStart(2, '0');
  }

  if (audio && play) {
    play.addEventListener('click', function () {
      if (audio.paused) audio.play(); else audio.pause();
    });
    audio.addEventListener('play', function () { play.classList.add('is-on'); play.setAttribute('aria-label', 'Pause the loop'); });
    audio.addEventListener('pause', function () { play.classList.remove('is-on'); play.setAttribute('aria-label', 'Play the loop'); });
    audio.addEventListener('loadedmetadata', function () { dur.textContent = t(audio.duration); seek.max = audio.duration; });
    audio.addEventListener('timeupdate', function () {
      cur.textContent = t(audio.currentTime);
      if (!seek.matches(':active')) seek.value = audio.currentTime;
    });
    seek.addEventListener('input', function () { audio.currentTime = +seek.value; });
  }

  /* ══ Workflow stages ══ */
  var STAGES = [
    ['01', 'Define', 'Ideation', '30 scored event concepts per sprint, trend and competitor scans.', 'The creative lead locks one direction. Volume is cheap, direction is not.'],
    ['02', 'Define', 'Art direction', 'Moodboards and style exploration at volume.', 'The art director signs the lock: palette, render, light, cast. The highest-leverage call in the pipeline.'],
    ['03', 'Define', 'UX exploration', 'Flow drafts and variant screens for lobby, progression and album.', 'A game designer checks the loop against the live economy.'],
    ['04', 'Produce', 'Visual assets', 'Batch generation against the locked tokens, background removal, cutouts.', 'A person picks 1 of 8 to 12. Never the first output.'],
    ['05', 'Produce', 'Music and sound', 'Loops, SFX and voice drafts from a style brief.', 'Audio direction clears the rights and judges every loop on a phone speaker.'],
    ['06', 'Produce', 'Copy', 'Bulk drafts from a voice guide, fanned out to every locale.', 'The copy lead picks and trims. Claims never ship unreviewed.'],
    ['07', 'Ship', 'Review and QA', 'Automated checks on palette, safe areas, contrast and artefacts.', 'Sign-off is mandatory: craft, economy and IP each have an owner.'],
    ['08', 'Ship', 'Iteration', 'Variant regeneration from performance data.', 'Data proposes, a person disposes. Two cycles, then ship or kill.'],
    ['09', 'Ship', 'Delivery', 'Export matrix, naming and versioned upload.', 'One release owner confirms the manifest.']
  ];

  var flow = document.getElementById('bbFlow');
  if (flow) {
    STAGES.forEach(function (s) {
      var a = document.createElement('article');
      a.className = 'bb-stage';
      a.innerHTML = '<div class="bb-stage__h"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>' +
        '<h3 class="bb-stage__t">' + s[2] + '</h3>' +
        '<p class="bb-stage__ai">' + s[3] + '</p>' +
        '<p class="bb-stage__g"><span class="bb-k">Human gate</span>' + s[4] + '</p>';
      flow.appendChild(a);
    });
  }

  /* ══ Chapter rail ══
     The current chapter is the last one whose top has passed a line a
     third of the way down, which stays right on fast scrolls and on
     anchor jumps, where first-intersection picks the wrong one. */
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
      // Keep the active pill in view on the horizontal rail
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
