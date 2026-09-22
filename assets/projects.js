/* ══════════════════════════════════════════════════════════
   Ran Segal · the work, once
   Every landing option reads from here so the copy exists in one
   place. Deliberately not layout-data.js: that file still carries
   the outcome-claim "Results" framing PRODUCT.md had removed.

   Rules baked into this data, from PRODUCT.md:
   · first person, about decisions rather than deliverables
   · "fact" is a verifiable scope fact, never an invented metric
   · the four solo tools lead, the Payoneer systems corroborate
   ══════════════════════════════════════════════════════════ */

window.WORK = [
  {
    n: '01', group: 'build',
    title: 'Voice tab switching for Chrome', alias: 'Naymo',
    line: 'I keep 40 tabs open and lose the one I need. Press a key, say the name, and you are there.',
    role: 'Built by me, solo', year: '2026',
    href: 'work/naymo.html', live: 'https://naymo.vercel.app/',
    fact: '10+ languages, Hebrew included',
    media: { kind: 'video', stem: 'naymo', w: 1098, h: 868 },
    alt: 'The Naymo overlay listening, then jumping to the named tab'
  },
  {
    n: '02', group: 'build',
    title: 'Kid-friendly Zoom controls', alias: 'Zoom for Kids',
    line: 'My kid could not find the mute button in a Zoom class, so I built the four controls a child can actually hit.',
    role: 'Built by me, solo', year: '2026',
    href: 'work/zoom-for-kids.html', live: 'https://segalitoo.github.io/Zoom-for-kids/',
    fact: '0 Chrome permissions requested',
    media: { kind: 'video', stem: 'zoomi', w: 1080, h: 1350 },
    alt: 'The Zoom for Kids panel: a reaction, a raised hand, then unmute'
  },
  {
    n: '03', group: 'build',
    title: 'On-brand ad generator', alias: 'Mint',
    line: 'At Payoneer I watched designers rebuild the same ad in four sizes, over and over.',
    role: 'Built by me, solo', year: '2026',
    href: 'work/mint.html', live: 'https://payoneer-ad-generator.vercel.app/',
    fact: '4 platform formats from one prompt',
    media: { kind: 'css', w: 1098, h: 868 },
    alt: 'One prompt filling four ad formats in turn'
  },
  {
    n: '04', group: 'build',
    title: 'Voice typing for Mac', alias: 'Shhh',
    line: 'macOS dictation handles English or Hebrew. I write in both, often in the same sentence.',
    role: 'Built by me, solo', year: '2026',
    href: 'work/shhh.html', live: 'https://segalitoo.github.io/Shhh/',
    fact: '2 languages, auto-detected',
    media: { kind: 'video', stem: 'shhh', w: 370, h: 300 },
    alt: 'The Shhh menu bar pill transcribing as it listens'
  },
  {
    n: '05', group: 'lead',
    title: 'Payoneer website redesign', alias: '',
    line: 'After the rebrand the site no longer matched the company. Sections, not pages, so every market could build from approved parts.',
    role: 'Led by me', year: '2023',
    href: 'work/payoneer-website.html', live: '',
    fact: 'Global site, multi-market rollout',
    media: { kind: 'still', img: 'website_1' },
    alt: 'Payoneer website redesign, hero and navigation'
  },
  {
    n: '06', group: 'lead',
    title: 'Scalable email design system', alias: '',
    line: 'Email was the worst offender. I built blocks that marketers could not get wrong.',
    role: 'Led by me', year: '2023',
    href: 'work/email-design-system.html', live: '',
    fact: 'Figma library, no designer in the loop',
    media: { kind: 'still', img: 'email_template_1' },
    alt: 'The email design system, template overview'
  },
  {
    n: '07', group: 'lead',
    title: 'Payoneer brand portal', alias: '',
    line: 'The guidelines lived in PDFs on shared drives, so every office read the brand slightly differently.',
    role: 'Led by me', year: '2022 to 2025',
    href: 'work/brand-portal.html', live: '',
    fact: 'Owned and maintained for three years',
    media: { kind: 'still', img: 'brand_portal_1' },
    alt: 'The Payoneer brand portal, guidelines overview'
  },
  {
    n: '08', group: 'lead',
    title: 'Customer image library', alias: '',
    line: 'Stock photography made Payoneer look like every competitor, so we shot our own customers.',
    role: 'Led by me', year: '2022',
    href: '', live: '',
    fact: 'Custom photography, shot for Payoneer',
    media: { kind: 'still', img: 'photoshoot_1' },
    alt: 'Custom photography of Payoneer customers'
  }
];

window.PROFILE = {
  name: 'Ran Segal',
  role: 'Creative Lead',
  headline: 'I lead creative teams and build the tools that make them faster.',
  lede: '14 years managing design and marketing at Payoneer and Taptica. Brand systems, global websites and design operations by day. AI production tools, browser extensions and apps by night.',
  spec: ['Creative Lead / Head of Design', 'Tel Aviv, hybrid or remote', 'Open to full-time and consulting'],
  email: 'segalitoo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ran-segal/',
  cv: '',
  history: [
    { org: 'Payoneer', years: '2020 to 2025', what: 'Design Manager' },
    { org: 'Taptica', years: '2011 to 2020', what: 'Creative Manager' }
  ]
};
