#!/usr/bin/env python3
"""Project pages in the chosen -g template, one per project on design-f.

Copy is lifted from the pages each project already had rather than
reinvented. The two Payoneer projects that never had a page get notes
built from the overview/challenge/solution lines design-a carries.
"""
import os, hashlib

ROOT = "/Users/rannsegal/Claude/ran-portfolio"

def ver(rel):
    try:
        with open(os.path.join(ROOT, rel), "rb") as f:
            return hashlib.sha1(f.read()).hexdigest()[:8]
    except OSError:
        return "0"

N = "night"; D = "day"

P = [
{
 "slug":"naymo","kind":N,"imgs":"naymo","h1":"Voice tab switching for Chrome",
 "eyebrow":["By night","2026","Built by me, solo","Live, v0.1.5"],
 "video":("naymo","1098 / 868","The Naymo overlay listening, then jumping to the named tab"),
 "lede":"I keep 40 tabs open and never click the right one first time. Naymo listens for a hotkey, "
        "takes any part of a tab name, and puts that tab in front before you finish saying it. It "
        "also saves tabs by voice, so the command still works on something you closed last week.",
 "notes":[("What annoyed me","Forty tabs, and the one I wanted was always the one I could not find. "
           "Every existing switcher still made me read a list."),
          ("What I decided","<b>Speech recognition runs locally in the page, not on a server.</b> "
           "No API cost, no transcript stored, and no round trip to wait on."),
          ("What I built","A Manifest V3 extension: a service worker, a content script injected "
           "across all URLs, and an overlay that matches loosely enough to survive a half-said name.")],
 "scope":[("10+ languages, Hebrew included","Recognition runs in the browser, so the list is the browser's"),
          ("Nothing leaves the machine","No server, no API cost, no transcript stored"),
          ("Manifest V3, service worker and content script","Designed, coded and released by me"),
          ("Live at v0.1.5","Saved tabs reopen after the tab is closed")],
 "shots":["The launcher over a dark browser, one tab matched and lifted above the rest",
          "Saving a tab by voice, so the command outlives the tab",
          "Hotkey to switched tab, the whole path in three steps"],
 "cta":("Try it","https://naymo.vercel.app/"),
},
{
 "slug":"zoom-for-kids","kind":N,"imgs":"zoom","h1":"Kid-friendly Zoom controls",
 "eyebrow":["By night","2026","Built by me, solo","Live, v1.1.0"],
 "video":("zoomi","760 / 950","The panel open in a Zoom class, a reaction sent and the mic toggled"),
 "lede":"My son could not find the mute button in his Zoom class. Zoom is drawn for adults in "
        "meetings, not for seven year olds in lessons, so I built an overlay that puts the four "
        "controls a child actually needs at a size they can hit, in a skin they pick themselves.",
 "notes":[("What annoyed me","Watching a child hunt a grey toolbar for the one control that mattered, "
           "while the lesson carried on without him."),
          ("What I decided","<b>The overlay asks for zero Chrome permissions</b> and its host access "
           "stops at zoom.us meeting URLs. When the user is seven, permissions are the whole safety story."),
          ("What I built","A Manifest V3 content script over the Zoom web client: reactions, hand "
           "raise and mute, mapped to the real controls underneath and sized for small hands.")],
 "scope":[("Four controls, nothing else","Reactions, hand raise and mute, at a size a child can hit"),
          ("Zero Chrome permissions","Host access scoped to zoom.us meeting URLs only"),
          ("Four skins, chosen by the kid","Classic, Gamer, Space and Candy, remembered between calls"),
          ("Five languages, Hebrew included","Live at v1.1.0")],
 "shots":["The panel in Hebrew, reactions across the top and mute held apart at the bottom",
          "A reaction going out, mapped to the Zoom control underneath",
          "The skins a child can switch between, remembered for the next call"],
 "cta":("Try it","https://segalitoo.github.io/Zoom-for-kids/"),
},
{
 "slug":"mint","kind":N,"imgs":"mint","h1":"On-brand ad generator",
 "eyebrow":["By night","2026","Built by me, solo","Live"],
 "video":None,
 "lede":"At Payoneer I watched designers rebuild the same ad in four sizes, week after week. Mint "
        "takes a brand kit, a format and a prompt, and returns finished creative with the copy "
        "already written for the platform. The output is real layout, not a model guessing at text.",
 "notes":[("What annoyed me","The fourth resize of an ad nobody had questioned yet. Skilled people "
           "spending their week on production rather than on the idea."),
          ("What I decided","<b>Headless Chrome composites the final artwork</b>, so type stays type. "
           "A model that paints a headline produces something nobody can edit afterwards."),
          ("What I built","React 19 and Vite on the front, Supabase for auth and the asset library, "
           "and Gemini generating both the visual and the platform copy inside the uploaded brand kit.")],
 "scope":[("One prompt, the whole set","Instagram, Facebook, LinkedIn and Stories, generated together"),
          ("Copy written per platform","Drawn from the brand kit you upload"),
          ("Type stays type","Headless Chrome composites the artwork, so the words are real"),
          ("Every result can be remixed","A near miss becomes the next starting point")],
 "shots":["The canvas: one prompt panel feeding a set of finished placements",
          "A generated placement with its copy, ready to remix",
          "The same brief carried across formats without a redraw"],
 "cta":("Try it","https://payoneer-ad-generator.vercel.app/"),
},
{
 "slug":"shhh","kind":N,"imgs":"shhh","h1":"Voice typing for Mac",
 "eyebrow":["By night","2026","Built by me, solo","Live"],
 "video":None,
 "hero_html":"""<!-- The dictation pill, rebuilt rather than screenshotted. It is
               nine divs and one keyframe on the Shhh site, so it comes across
               as markup: always sharp, no image to load, and it actually
               moves. No card and no ground behind it, so the UI floats on the
               page the way it floats over whatever app you are in. -->
          <div class="pill-stage">
            <div class="pill" role="img" aria-label="The Shhh dictation pill, listening, with the phrase it has picked up so far">
              <div class="pill__wave" aria-hidden="true">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
              <p class="pill__t">I want to send a quick note</p>
            </div>
          </div>""",
 "lede":"macOS makes you pick English or Hebrew. I write both, often inside one sentence, so Shhh "
        "listens from the menu bar, works out which language is which while you talk, and pastes "
        "into whatever app is in front. Grammar is cleaned up once you stop, not mid-thought.",
 "notes":[("What annoyed me","Switching dictation language mid-sentence, which is exactly when you "
           "cannot spare the attention."),
          ("What I decided","<b>The grammar pass waits until you stop talking.</b> Correcting mid-flow "
           "guesses at a sentence that is not finished, and gets it wrong often enough to be worse."),
          ("What I built","A Python core with a Swift menu bar app on top, streaming to Google Cloud "
           "Speech-to-Text over gRPC so words land while you are still speaking.")],
 "scope":[("English and Hebrew, no mode switch","Language detected as you speak"),
          ("Words appear while you talk","A streaming gRPC connection carries them as you speak"),
          ("Lands in the frontmost app","A global hotkey anywhere, pasted through AppleScript"),
          ("Grammar cleaned on a finished thought","The pass runs once dictation stops")],
 "shots":["Dictating into a document, the pill showing the phrase as it lands",
          "The menu bar app, out of the way until the hotkey",
          "A bilingual sentence transcribed without a mode switch"],
 "cta":("Try it","https://segalitoo.github.io/Shhh/"),
},
{
 "slug":"payoneer-website","kind":D,"imgs":"website","h1":"Payoneer website redesign",
 "eyebrow":["By day","Payoneer","2023","Led by me"],
 "video":None,
 "lede":"After the rebrand, the site no longer matched the company. I led the redesign that turned "
        "the new identity into a working web experience, and built it as a modular system so "
        "regional teams could adapt pages to their market without redrawing them.",
 "notes":[("What I inherited","A legacy interface that predated the rebrand, with page templates that "
           "had drifted apart market by market."),
          ("What I decided","To solve it as a system rather than a redesign. <b>Shared components with "
           "defined flex points</b>, so a market could change what it needed and nothing else."),
          ("What I led","The design direction, the component library, and the flows through to handoff.")],
 "scope":[("Global site, multi-market rollout","One system, many markets, no separate builds"),
          ("Component-based, with defined flex points","A market changes what it needs and nothing else"),
          ("Direction, library and handoff","Led by me across 2023"),
          ("Built to be adapted","Regional teams ship without a designer in the loop")],
 "shots":["The homepage after the rebrand, the arc motif carrying into the product story",
          "A product page assembled from the shared components",
          "The same template adapted for another market"],
 "cta":None,
},
{
 "slug":"email-design-system","kind":D,"imgs":"email_template","h1":"Scalable email design system",
 "eyebrow":["By day","Payoneer","2023","Led by me"],
 "video":None,
 "lede":"Every team built its emails from scratch, so no two matched and designers spent their week "
        "on production. I led a Figma template system with pre-approved components that lets "
        "marketers assemble on-brand email without a designer in the loop.",
 "notes":[("What I inherited","Fragmented production across teams and regions, with no single source "
           "of truth and no way to tell an approved layout from an improvised one."),
          ("What I decided","That the bottleneck was designers, not templates. <b>The system had to be "
           "usable by someone who had never opened Figma before</b>, or it would not be used at all."),
          ("What I led","The component library, the layout patterns, and the rules that keep an "
           "assembled email on brand once a designer is no longer checking it.")],
 "scope":[("A Figma template library","Approved components that snap together"),
          ("Built for marketers, not designers","Usable by someone who had never opened Figma"),
          ("Rules that hold without review","The layout keeps it on brand on its own"),
          ("Production time off the design team","Led by me in 2023")],
 "shots":["The builder beside the mailer it produces, controls on one side and output on the other",
          "A template assembled from approved blocks",
          "The same system rendering a different campaign"],
 "cta":None,
},
{
 "slug":"brand-portal","kind":D,"imgs":"brand_portal","h1":"Payoneer brand portal",
 "eyebrow":["By day","Payoneer","2022 to 2025","Led by me"],
 "video":None,
 "lede":"The guidelines lived in PDFs on shared drives, so every office read the brand slightly "
        "differently. I led the build of a portal that made the current guidance the easiest thing "
        "to find, covering logo, typography, colour, photography and tone of voice, with the assets "
        "downloadable in the same place.",
 "notes":[("What I inherited","Brand guidance as a set of PDFs on shared drives, with no way to tell "
           "which version was current. Every office worked from whichever copy it happened to have, "
           "so the brand drifted a little further apart with each campaign."),
          ("What I decided","That the fix was not a better document. <b>The current guidance had to be "
           "the easiest thing in the building to find</b>, and the asset had to sit next to the rule "
           "that governs it, or people would keep reaching for the copy already on their desktop."),
          ("What I led","The build of a portal covering logo, typography, colour, photography and tone "
           "of voice, with searchable guidance, downloadable collections, and the icon and persona "
           "libraries in the same place. Owned and maintained from 2022 to 2025.")],
 "scope":[("Logo, type, colour, photography, tone of voice","The five things every office was interpreting on its own"),
          ("Assets beside the rule that governs them","Downloadable from the page you are already reading"),
          ("Icon and persona libraries included","Searchable, and downloadable as collections"),
          ("Owned and maintained 2022 to 2025","Three years, not a launch")],
 "shots":["Persona photography sets, browsable and downloadable as collections",
          "A single asset with its formats and sizes beside it",
          "The icon library, with the writing guidance next to it"],
 "cta":None,
},
{
 "slug":"customer-image-library","kind":D,"imgs":"photoshoot","h1":"Customer image library",
 "eyebrow":["By day","Payoneer","2022","Led by me"],
 "video":None,
 "lede":"Stock imagery made Payoneer look like every competitor it had, which works against a brand "
        "built on global inclusion. I led photoshoots across several regions, casting models to "
        "represent the customers we actually serve, and catalogued the results so any team could "
        "find the right frame without asking.",
 "notes":[("What I inherited","Generic stock, interchangeable with what every competitor was running, "
           "and a promise about global inclusion that the pictures did not support."),
          ("What I decided","To commission original photography rather than buy better stock. "
           "<b>The people in frame are cast models, not customers</b>, chosen to look like the "
           "businesses the company actually serves."),
          ("What I led","Shoots across multiple regions, then the catalogue: organised by region, use "
           "case and theme so it stayed findable once the excitement wore off.")],
 "scope":[("Original shoots, several regions","Commissioned for Payoneer and owned outright"),
          ("Models cast to represent customers","Chosen for the businesses the company serves"),
          ("Catalogued by region, use case and theme","Findable without asking a designer"),
          ("An owned library","No further reliance on generic stock")],
 "shots":["A grid from the library, cast to represent customers across regions",
          "The same set applied across channels",
          "Scenarios shot to match real use cases rather than generic office stock"],
 "cta":None,
},
{
 "slug":"icon-packages","kind":D,"imgs":"icon_packages","h1":"Icon packages",
 "eyebrow":["By day","Payoneer","2022 to 2025","Led by me"],
 "video":None,
 "lede":"Icons were drawn fresh for every feature and campaign, so nothing matched and every new "
        "piece of work started with a redraw. I led one tiered system covering functional UI, "
        "illustrative brand and animated icons, sharing a stroke weight and a set of proportions.",
 "notes":[("What I inherited","Ad hoc icons with no shared standard. The visual language fragmented, "
           "and every new feature or campaign waited on someone drawing another set."),
          ("What I decided","Three tiers rather than one library. <b>Functional, illustrative and "
           "animated share a stroke weight and a set of proportions</b>, so they read as one family "
           "while each does a job the others cannot."),
          ("What I led","The system and the usage guidance that came with it, maintained alongside "
           "the brand portal from 2022 to 2025.")],
 "scope":[("Three tiers, one family","Functional, illustrative and animated"),
          ("One stroke weight and proportion set","What makes the tiers read as a single language"),
          ("Usage guidance included","So the tiers are not used interchangeably"),
          ("Maintained 2022 to 2025","Alongside the brand portal")],
 "shots":["The functional grid, drawn to one stroke weight",
          "Illustrative icons against the functional set they sit beside",
          "Animated icons, the third tier of the same family"],
 "cta":None,
},
]

BY = {p["slug"]: p for p in P}
ORDER = [p["slug"] for p in P]

THEME = ('<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
         'stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4'
         'M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>\n        '
         '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
         'stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>')


def img_name(p, i):
    """mint borrows three Payoneer frames; every other project has its own four."""
    if p["imgs"] == "mint":
        return ["mint_1", "payoneer_1", "payoneer_2", "payoneer_3"][i]
    return "%s_%d" % (p["imgs"], i + 1)


def hero(p):
    # A project may supply its own hero markup. Shhh does: its dictation
    # pill is nine divs and one keyframe on the product site, so the page
    # carries the real component instead of a screenshot of it.
    if p.get("hero_html"):
        return p["hero_html"]
    if p["video"]:
        stem, ar, label = p["video"]
        return f'''<figure class="live" data-live style="--ar:{ar}">
            <video class="live__v" poster="../assets/media/{stem}-poster.webp" muted loop playsinline preload="none"
                   aria-label="{label}">
              <source src="../assets/media/{stem}.webm" type="video/webm">
              <source src="../assets/media/{stem}.mp4" type="video/mp4">
            </video>
            <img class="live__print" src="../assets/media/{stem}-poster.webp" alt="" aria-hidden="true">
          </figure>'''
    n = img_name(p, 0)
    return f'''<figure class="pg-shot">
            <img src="../images/opt/{n}-1440.webp"
                 srcset="../images/opt/{n}-720.webp 720w, ../images/opt/{n}-1440.webp 1440w"
                 sizes="(max-width: 900px) 100vw, 620px"
                 alt="{p['shots'][0]}" width="1440" height="761" fetchpriority="high" decoding="async">
          </figure>'''


def gallery(p):
    out = ""
    for i in range(1, 4):
        n = img_name(p, i)
        cap = p["shots"][i - 1]
        out += f'''          <figure class="pg-gal__i">
            <img src="../images/opt/{n}-1440.webp"
                 srcset="../images/opt/{n}-720.webp 720w, ../images/opt/{n}-1440.webp 1440w"
                 sizes="(max-width: 900px) calc(100vw - 40px), 1168px"
                 alt="{cap}" width="1440" height="761" loading="lazy" decoding="async">
          </figure>
'''
    return out


def page(p):
    nxt = BY[ORDER[(ORDER.index(p["slug"]) + 1) % len(ORDER)]]
    anchor = "ai" if p["kind"] == N else "work"
    notes = "".join(f'''        <div>
          <h2 class="pg-note__k">{k}</h2>
          <p class="pg-note__d">{d}</p>
        </div>
''' for k, d in p["notes"])
    scope = "".join(f'          <p class="pg-scope__i">{a}<span>{b}</span></p>\n' for a, b in p["scope"])
    cta = ""
    if p["cta"]:
        cta = ('\n          <div class="acts"><a class="btn btn--fill" href="%s" target="_blank" '
               'rel="noopener">%s <i>&rarr;</i></a></div>' % (p["cta"][1], p["cta"][0]))

    return f'''<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{p['h1']} &middot; Ran Segal</title>
  <meta name="description" content="{p['lede'][:155]}">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="../brand-system/fonts.css">
  <link rel="stylesheet" href="../brand-system/tokens.css">
  <link rel="stylesheet" href="../assets/site.css?v={ver('assets/site.css')}">
  <link rel="stylesheet" href="../assets/live.css?v={ver('assets/live.css')}">
  <link rel="stylesheet" href="../assets/inner-g.css?v={ver('assets/inner-g.css')}">
  <link rel="stylesheet" href="../assets/review.css?v={ver('assets/review.css')}">
  <script src="../assets/analytics.js?v={ver('assets/analytics.js')}" defer></script>
  <script src="../assets/site.js?v={ver('assets/site.js')}" defer></script>
  <script src="../assets/live.js?v={ver('assets/live.js')}" defer></script>
  <script src="../assets/review.js?v={ver('assets/review.js')}" defer></script>
</head>

<body class="pg">
  <nav class="nav" id="nav">
    <div class="nav__in">
      <a class="nav__me" href="../design-f.html">Ran Segal <span>&middot; Creative Manager</span></a>
      <div class="nav__links">
        <a class="nav__a" href="../design-f.html#ai">AI tools</a>
        <a class="nav__a" href="../design-f.html#work">Work</a>
      </div>
      <button class="nav__theme" id="themeBtn" aria-label="Toggle light and dark theme">
        {THEME}
      </button>
    </div>
  </nav>

  <main>
    <header class="pg-hero">
      <div class="pg-wrap pg-hero__in">
        <div>
          <a class="pg-back" href="../design-f.html#{anchor}"><i>&larr;</i> All work</a>
          <h1 class="pg-h1">{p['h1']}</h1>
          <p class="pg-lede">{p['lede']}</p>{cta}
        </div>
        <div class="pg-hero__art">
          {hero(p)}
        </div>
      </div>
    </header>

    <div class="pg-wrap">
      <section class="pg-notes">
{notes}      </section>

      <section class="pg-scope">
        <h2 class="pg-scope__k">Scope</h2>
        <div class="pg-scope__g">
{scope}        </div>
      </section>

      <section class="pg-ev" aria-label="Screens from the project">
        <div class="pg-gal">
{gallery(p)}        </div>
      </section>

      <nav class="pg-next">
        <a href="{nxt['slug']}-g.html">
          <span><span class="pg-next__k">Next</span><span class="pg-next__t" style="display:block">{nxt['h1']}</span></span>
          <i>&rarr;</i>
        </a>
      </nav>

      <footer class="pg-foot">
        <span>Ran Segal &copy; 2026</span>
        <span class="pg-foot__links">
          <a href="https://www.linkedin.com/in/ran-segal/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:segalitoo@gmail.com">Email</a>
        </span>
      </footer>
    </div>
  </main>

  <div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Image viewer">
    <button class="lb__x" aria-label="Close image viewer">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <img id="lbImg" alt="">
  </div>

  <script>
    /* site.js wires the viewer to its own frame classes. The gallery
       uses neither, so it hands its own figures over. */
    document.addEventListener('click', function (e) {{
      var img = e.target.closest('.pg-gal__i img');
      if (!img) return;
      var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg');
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
    }});
  </script>
</body>

</html>
'''


for p in P:
    path = os.path.join(ROOT, "work", "%s-g.html" % p["slug"])
    with open(path, "w") as f:
        f.write(page(p))
    print("wrote work/%s-g.html" % p["slug"])
