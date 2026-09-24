/* ══════════════════════════════════════════════════════════
   Brief generator · the assembly step
   The same template the n8n LLM node runs, done deterministically
   in the page. That is the whole claim of the project: a brief is a
   function of the request and the locked art direction, so it can be
   rebuilt on every keystroke and nobody has to write one from blank.
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var DNA = {
    style: 'glossy stylized 3D render, Pixar-like casual mobile game asset',
    light: 'warm golden-hour lighting, subtle rim light',
    form: 'big expressive friendly eyes, soft rounded shapes',
    tech: 'subsurface scattering, glossy highlights, high detail, premium mobile game quality',
    palette: 'Sunset Gold #FFC24B · Amber Glow #FF9E45 · Coral Sunset #FF6F61 · Rose Dusk #FF5C7A · Tropical Teal #1FB8A6 · Warm Sand #F3D9A4 · Dusk Purple #3A2A5C · Cream Light #FFF4E2',
    voice: 'warm summer energy, collection-first, gentle FOMO, short and rhythmic'
  };

  var TYPES = {
    keyart: {
      label: 'Key art / promo image',
      spec: 'Vertical promo image, store ready. Faces readable at a 160px thumbnail. Hold clean space across the top for the event title.',
      prompt: function (i) { return 'Premium ' + DNA.style + ', vertical key art composition. ' + i + '. Golden-hour sunset over a tropical bay, festive beach setting with bunting and paper lanterns. ' + DNA.form + ', ' + DNA.tech + ', ' + DNA.light + ', long soft shadows, clean uncluttered background, generous clear space across the top for the event title. Vibrant, premium, inviting, 4k.'; },
      qa: ['Reads at thumbnail size (check at 160px)', 'All faces unobstructed and lit', 'Title space held', 'Palette compliance against DNA v1.3', 'No text baked into the image']
    },
    pet: {
      label: 'Collectible character',
      spec: 'Full-body character on a clean gradient for cutout. Must sit beside the existing cast without style drift.',
      prompt: function (i) { return 'Cute collectible sea-creature character, ' + DNA.style + '. [CHARACTER: ' + i + ']. ' + DNA.form + ', ' + DNA.tech + ', ' + DNA.light + '. Centered, full body, clean neutral soft-gradient background for easy cutout, consistent character style.'; },
      qa: ['Silhouette readable at icon size', 'Eye language matches the existing cast', 'Style line unchanged from DNA v1.3', 'Cutout-friendly background', 'Generate 8 or more variants before selecting']
    },
    ui: {
      label: 'UI screen background',
      spec: 'A background plate with no characters and no text, and clear space in the middle for UI panels. 9:16 vertical.',
      prompt: function (i) { return 'Mobile game UI background, ' + DNA.style.replace(' asset', '') + ', ' + i + ', golden-hour sunset, tropical bay, paper lanterns and bunting, soft depth of field, no characters, no text, clean composition with clear central space for UI panels, vertical 9:16 aspect.'; },
      qa: ['No characters or text in the plate', 'Centre calm enough for panels', 'Contrast supports light UI chrome', 'Palette compliance against DNA v1.3']
    },
    music: {
      label: 'Music loop',
      spec: 'A 60 to 90 second instrumental loop, seamless. Judge it on a phone speaker at low volume.',
      prompt: function (i) { return 'Upbeat tropical summer festival background music for a casual mobile game, ' + i + ', cheerful and warm, ukulele, marimba, steel drums, light hand percussion, playful bright melody, moderate upbeat tempo, seamless loop, instrumental, no vocals, polished game audio, 60-90 seconds.'; },
      qa: ['Loop point is seamless', 'Survives 30 repetitions without fatigue', 'Does not fight the win fanfares', 'Generate 4 to 6 candidates and log the rejects']
    },
    copy: {
      label: 'Marketing copy',
      spec: 'Banner: 5 to 8 words. Popup: one line and a button label. Ready for localisation, no idioms.',
      prompt: function (i) { return 'Write 5 options each for a store feature banner (5-8 words) and an in-game event popup (one line plus a button label) for: ' + i + '.\nVoice: ' + DNA.voice + '. The collection is the hero, the bingo mechanic stays implicit. Avoid idioms that break in localisation.'; },
      qa: ['Banner within 5 to 8 words', 'Button label is a verb phrase', 'No claims legal cannot verify', 'Tone matches the voice guide', 'Safe to localise']
    }
  };

  function $(id) { return document.getElementById(id); }
  var type = $('bType'), ev = $('bEvent'), intent = $('bIntent'), due = $('bDue'), req = $('bReq');
  var out = $('outBody'), name = $('outName');
  if (!type || !out) return;

  var brief = '';

  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function build(flash) {
    var k = type.value, t = TYPES[k];
    var e = ev.value.trim() || 'Summer Festival';
    var i = intent.value.trim() || '(no intent given)';
    var d = due.value.trim() || 'TBD';
    var r = req.value.trim() || 'unassigned';
    var slug = e.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    brief =
      '# CREATIVE BRIEF · ' + e + ' · ' + t.label + '\n' +
      'Brief Generator v1 · DNA: summer-festival v1.3 · status: AWAITING LEAD APPROVAL\n\n' +
      '## Objective\n' + t.label + ' for the "' + e + '" event. Intent: ' + i + '\n\n' +
      '## Deliverable spec\n' + t.spec + '\nDeadline: ' + d + ' · Requester: ' + r + '\n\n' +
      '## Art direction locks (inherited, not editable here)\n' +
      'STYLE   ' + DNA.style + '\nLIGHT   ' + DNA.light + '\nFORM    ' + DNA.form + '\nTECH    ' + DNA.tech + '\nPALETTE ' + DNA.palette + '\n\n' +
      '## Ready-to-run prompt\n' + t.prompt(i) + '\n\n' +
      '## QA checklist\n' + t.qa.map(function (q) { return '[ ] ' + q; }).join('\n') + '\n\n' +
      '## Process\n[ ] Log every generation in the iteration log, with verdict and reason\n' +
      '[ ] File naming: ' + slug + '_' + k + '_vNN\n[ ] Rejected outcomes kept, not deleted\n\n' +
      'Approval: creative lead ______ · art direction owner consulted if a lock needs changing';

    name.textContent = 'brief_' + slug + '_' + k + '.md';
    out.innerHTML = esc(brief)
      .replace(/^(#+ .*)$/gm, '<span class="h">$1</span>')
      .replace(/^(STYLE|LIGHT|FORM|TECH|PALETTE)( +)/gm, '<span class="s">$1</span>$2');

    if (flash) {
      out.classList.remove('is-fresh');
      void out.offsetWidth;
      out.classList.add('is-fresh');
    }
  }

  var timer = null;
  [ev, intent, due, req].forEach(function (f) {
    f.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { build(false); }, 120); });
  });
  type.addEventListener('change', function () { build(true); out.scrollTop = 0; });

  $('copyOut').addEventListener('click', function (e) {
    var b = e.currentTarget;
    try { navigator.clipboard.writeText(brief).catch(function () {}); } catch (err) { /* blocked */ }
    b.textContent = 'Copied';
    b.classList.add('is-done');
    setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('is-done'); }, 1400);
  });

  $('dlOut').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([brief], { type: 'text/markdown' }));
    a.download = name.textContent;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  build(false);
})();
