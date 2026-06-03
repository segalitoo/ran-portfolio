// Shared project data + carousel logic for layout demos
window.PROJECTS = [
  {
    id: 'payoneer-website', num: '01', title: 'Payoneer Website Redesign',
    desc: 'Translating Payoneer’s “For Everyone” promise into a cohesive and scalable web experience.',
    role: 'Design Manager, Payoneer · 2023',
    overview: 'After a major rebrand, Payoneer needed its website to match the refreshed identity - communicating trust, simplicity, and inclusivity across diverse global markets.',
    challenge: 'Modernizing a legacy interface into a cohesive platform that scales across markets while staying true to the “For Everyone” brand promise.',
    solution: 'Built a modular design system with intuitive user flows that balanced visual consistency with regional flexibility - every page distinctly Payoneer, yet adaptable to local needs.',
    results: ['Unified global brand identity established', 'Simplified complex user journey flows', 'Streamlined navigation for better conversion', 'Enhanced cross-platform visual consistency'],
    images: [['images/website_1.png', 'hero and navigation'], ['images/website_2.png', 'key features'], ['images/website_3.png', 'customer stories'], ['images/website_4.png', 'footer and CTA']]
  },
  {
    id: 'email-design-system', num: '02', title: 'Scalable Email Design System',
    desc: 'A smart Figma template system designed to accelerate the production of on-brand operational and marketing emails.',
    role: 'Design Manager, Payoneer · 2023',
    overview: 'A centralized Figma template system enabling designers and marketers to produce on-brand emails rapidly - without starting from scratch each time.',
    challenge: 'Email production was fragmented across teams and regions - inconsistent branding, duplicated effort, and no single source of truth for design.',
    solution: 'A modular template library with pre-approved components and layout patterns, empowering non-designers to assemble on-brand emails independently.',
    results: ['Accelerated design-to-delivery timeline', 'Standardized visual language across teams', 'Eliminated design bottlenecks', 'Simplified editing for rapid iteration'],
    images: [['images/email_template_1.png', 'template overview'], ['images/email_template_2.png', 'component library'], ['images/email_template_3.png', 'layout variations'], ['images/email_template_4.png', 'brand guidelines']]
  },
  {
    id: 'brand-portal', num: '03', title: 'Payoneer Brand Portal',
    desc: 'A centralized digital hub for our global brand guidelines, accessible to every employee and partner.',
    role: 'Design Manager, Payoneer · 2022–2025',
    overview: 'A single, authoritative source for Payoneer’s brand guidelines - always current, always accessible to every employee and partner worldwide.',
    challenge: 'Guidelines were scattered across PDFs and shared drives. Different offices interpreted the brand differently, diluting Payoneer’s identity.',
    solution: 'An interactive web portal with searchable guidelines, downloadable assets, and usage examples - covering logo, typography, color, photography, and tone of voice.',
    results: ['Single source of brand truth', 'Unified global visual consistency', 'Streamlined internal and external access', 'Reduced asset mismanagement errors'],
    images: [['images/brand_portal_1.png', 'overview and guidelines'], ['images/brand_portal_2.png', 'icon library'], ['images/brand_portal_3.png', 'PowerPoint templates'], ['images/brand_portal_4.png', 'asset library']]
  },
  {
    id: 'image-library', num: '04', title: 'Custom Customers’ Image Library',
    desc: 'Moving beyond stock photography: creating a bespoke asset library to truly represent our global user base.',
    role: 'Design Manager, Payoneer · 2022',
    overview: 'Replacing generic stock with a custom photography library featuring real users and scenarios from around the globe.',
    challenge: 'Stock imagery felt inauthentic and interchangeable with competitors - a disconnect from Payoneer’s promise of global inclusion.',
    solution: 'Organized photo shoots across multiple regions, building a library organized by region, use case, and theme for easy cross-team access.',
    results: ['Owned library of diverse assets', 'Scalable cross-channel visual language', 'Unified, authentic brand identity', 'Eliminated reliance on generic stock'],
    images: [['images/photoshoot_1.png', 'diverse global customers'], ['images/photoshoot_2.png', 'regional photo shoots'], ['images/photoshoot_3.png', 'customer portraits'], ['images/photoshoot_4.png', 'organized by theme']]
  },
  {
    id: 'icon-packages', num: '05', title: 'Icon Packages',
    desc: 'A scalable icon ecosystem designed to bridge the gap between functional UI and expressive brand storytelling.',
    role: 'Design Manager, Payoneer · 2022–2025',
    overview: 'A comprehensive icon system spanning functional UI, illustrative brand, and animated motion icons - all working as one cohesive visual language.',
    challenge: 'Icons were created ad-hoc with no shared standards, causing visual fragmentation and bottlenecks for every new feature or campaign.',
    solution: 'A tiered system with clear usage guidelines - functional, illustrative, and animated - sharing consistent stroke weights, proportions, and style.',
    results: ['Unified brand visual language globally', 'Streamlined internal design team workflows', 'Scalable assets for diverse needs', 'Enhanced user engagement through motion'],
    images: [['images/icon_packages_1.png', 'icon ecosystem overview'], ['images/icon_packages_2.png', 'library structure'], ['images/icon_packages_3.png', 'icon categories'], ['images/icon_packages_4.png', 'complexity tiers']]
  },
  {
    id: 'ai-1', num: '06', title: 'Zeph - Voice tab switching for Chrome', ai: true,
    desc: 'A Chrome extension for switching browser tabs by voice. Press Alt+Space, say the tab name, and you’re there in under a second. Supports 10+ languages including Hebrew.',
    role: 'Personal project · 2025', cta: 'https://zeph-landing.vercel.app/',
    images: [['images/zeph_1.png', 'voice overlay'], ['images/zeph_2.png', 'save by voice'], ['images/zeph_3.png', 'how it works'], ['images/zeph_4.png', 'saved tabs']]
  },
  {
    id: 'ai-2', num: '07', title: 'Zoomi - Kid-friendly Zoom controls', ai: true,
    desc: 'A Chrome extension that adds a kid-friendly control panel to Zoom - big colorful buttons for reactions, hand raise, and mute, designed for children ages 6–12.',
    role: 'Personal project · 2025', cta: 'https://segalitoo.github.io/Zoom-for-kids/',
    images: [['images/zoom_1.png', 'landing page'], ['images/zoom_2.png', '4 themes'], ['images/zoom_3.png', 'installation'], ['images/zoom_4.png', 'in a meeting']]
  },
  {
    id: 'ai-3', num: '08', title: 'Mint - On-brand ad generator', ai: true,
    desc: 'A tool for generating on-brand ad creatives across Instagram, Facebook, LinkedIn, and Stories. Upload your brand kit, pick a format, and get ready-to-use visuals in seconds.',
    role: 'Personal project · 2025', cta: 'https://payoneer-ad-generator.vercel.app/',
    images: [['images/mint_1.png', 'hero screen'], ['images/payoneer_2.png', 'format picker'], ['images/payoneer_3.png', 'brand kit'], ['images/payoneer_4.png', 'remix view']]
  },
  {
    id: 'ai-4', num: '09', title: 'Shhh - Voice typing for Mac', ai: true,
    desc: 'A macOS dictation tool that transcribes speech in real time - in English and Hebrew - and pastes it directly into any app. Built with Google Cloud Speech-to-Text.',
    role: 'Personal project · 2025', cta: 'https://segalitoo.github.io/Shhh/',
    images: [['images/shhh_1.png', 'live dictation'], ['images/shhh_2.png', 'menu bar UI'], ['images/shhh_3.png', 'bilingual'], ['images/shhh_4.png', 'in use']]
  }
];

window.PG_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
window.PG_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

// Build the Split Edge carousel markup for a project's images
window.buildGallery = function (images) {
  const g = document.createElement('div');
  g.className = 'gal';
  const slides = images.map(([src, alt]) =>
    `<img src="${src}" alt="${alt}">`).join('');
  g.innerHTML = `
    <div class="gal__vp"><div class="gal__track">${slides}</div></div>
    <button class="gal__arrow gal__arrow--prev" aria-label="Previous">${window.PG_PREV}</button>
    <button class="gal__arrow gal__arrow--next" aria-label="Next">${window.PG_NEXT}</button>
    <div class="gal__dots">${images.map((_, i) => `<span class="gal__dot${i === 0 ? ' is-active' : ''}"></span>`).join('')}</div>`;
  return g;
};

// Activate a built gallery (autoplay, arrows, dots, adaptive height)
window.initGallery = function (gallery) {
  const imgs = Array.from(gallery.querySelectorAll('img'));
  if (imgs.length < 2) return;
  const track = gallery.querySelector('.gal__track');
  const vp = gallery.querySelector('.gal__vp');
  const dots = Array.from(gallery.querySelectorAll('.gal__dot'));
  let index = 0, timer = null, inView = false, hovering = false;
  const total = imgs.length, DUR = 5000;

  function setH() { const h = imgs[index].clientHeight; if (h) vp.style.height = h + 'px'; }
  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    setH();
  }
  function go(i) { index = (i + total) % total; render(); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function play() { stop(); if (inView && !hovering) timer = setInterval(() => go(index + 1), DUR); }

  gallery.querySelector('.gal__arrow--prev').addEventListener('click', () => { go(index - 1); play(); });
  gallery.querySelector('.gal__arrow--next').addEventListener('click', () => { go(index + 1); play(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); play(); }));
  gallery.addEventListener('mouseenter', () => { hovering = true; stop(); });
  gallery.addEventListener('mouseleave', () => { hovering = false; play(); });

  const io = new IntersectionObserver(e => { inView = e[0].isIntersecting; play(); }, { threshold: 0.3 });
  io.observe(gallery);
  imgs.forEach(img => img.addEventListener('load', () => { if (imgs[index] === img) setH(); }));
  window.addEventListener('resize', setH);
  render();
  if (imgs[index].complete) setH();
};
