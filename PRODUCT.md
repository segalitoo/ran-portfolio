# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and design leaders evaluating candidates for an in-house creative
or design leadership role. They arrive from a job application, a LinkedIn profile,
or an emailed link, usually with other candidates open in adjacent tabs and a few
minutes to decide. Their job is to decide whether to interview.

Recruiters and freelance enquiries are secondary and were not confirmed as an
audience to design for.

## Product Purpose

A personal portfolio for Ran Segal. Success is an interview invitation.

It exists to close the gap between how Ran is read on paper and what he actually
does: the CV reads as someone who oversees design work, while four shipped
products were designed, coded and released by him personally. The site's job is to
make the second thing the first thing a reader encounters.

## Positioning

Builds the tools the team uses.

Not a portfolio of side products, but of production tooling that makes real
creative teams faster. The origin story is the mechanism: Mint exists because Ran
watched Payoneer designers rebuild the same ad in four sizes, over and over.
A design manager who briefs tools cannot honestly make this claim; one who ships
them can.

## Operating Context

- Published at `https://segalitoo.github.io/ran-portfolio/` from GitHub Pages.
- Circulated as a bare link in applications, LinkedIn messages and email, so
  link-preview cards and per-project deep links are functional requirements, not
  polish. A single project is often the thing worth sending, not the whole site.
- Read on desktop first, phone second.
- Content is split in two: four tools Ran built solo, and three brand systems he
  led at Payoneer as Design Manager.

## Capabilities and Constraints

- **Binding:** the Crafel design system (see Brand Commitments).
- **Current implementation, explicitly not confirmed as durable:** vanilla
  HTML, CSS and JavaScript with no framework and no build step, served statically.
  `CLAUDE.md` states this as a convention, but it was not marked as a constraint
  future work must preserve. A rebuild may change stack.
- **Present but not marked binding:** light and dark themes (persisted to
  `localStorage` under `v2-theme`), and Hebrew/RTL support. Both exist in the
  wider workspace; neither was confirmed as a requirement for this site.
- Seven projects. It was nine: "Icon packages" and "Customer image library" were
  cut as production tasks that diluted the rest.
- Every one of the 36 screenshots in `images/` is 2120x1120, a single 1.893:1
  landscape ratio. No portrait, square or detail-crop exports exist yet. Varied
  re-exports are outstanding; `ASSET-SPEC.md` records what is needed.
- Video slots exist for all four tools at `videos/<tool>.mp4` and fall back to a
  poster still. No recordings exist yet; `videos/README.md` records the spec.

## Brand Commitments

- The **Crafel design system** is authoritative and binding. Cobalt `#2563EB`
  primary, coral `#FF5D52` accent, near-navy `#0C1330` ink, Inter for text and
  DM Serif Display for display type. Tokens live in `brand-system/tokens.css`
  and are the source of truth; colours are not to be hardcoded.
- Name: Ran Segal. Title in use: Creative Lead, previously Design Manager at
  Payoneer. Tenure: Taptica 2011 to March 2020, Payoneer March 2020 to
  December 2025, which is the 14 years the home page claims. The Taptica
  entry in `history` is a past job title and stays Creative Manager.
- **No em dashes** in any generated copy. Standing instruction.
- Project copy is written in the first person about decisions made, not
  deliverables produced.

## Evidence on Hand

Real and verifiable:

- Four live tools with public URLs: Naymo (voice tab switching), Zoom for Kids,
  Mint (ad generator), Shhh (bilingual dictation).
- Technical claims verified against source, not marketing copy: Manifest V3 in
  both extensions, **zero Chrome permissions** requested by Zoom for Kids,
  Google Cloud Speech-to-Text over streaming gRPC in Shhh, Gemini plus Supabase
  in Mint.
- Three Payoneer programmes: website redesign (2023), email design system (2023),
  brand portal (2022 to 2025).
- 36 product screenshots in `images/`.

Absent, and not to be fabricated by future work:

- **No performance, conversion, adoption or revenue metrics of any kind.** The
  "Results" copy was deliberately rewritten from outcome claims to verifiable
  scope facts because no measurable outcomes were available. Do not reintroduce
  numbers that cannot be sourced.
- No testimonials, client quotes, press, or named customers.
- No screen recordings of any tool running.
- **Evidence gap against the positioning:** three of the four tools (Naymo,
  Zoom for Kids, Shhh) are personal-use software. Only Mint targets a team
  workflow, and it was built after leaving that team rather than deployed to it.
  The "tools the team uses" claim currently runs ahead of what the artefacts
  prove. Future work should either strengthen the Mint evidence or phrase the
  claim so it stays true.

## Product Principles

1. **Evidence of building outranks description of leading.** Where a claim can be
   shown running, show it running rather than describing it.
2. **Every factual claim is checkable in a source or it is cut.** Scope facts
   beat adjectives; invented metrics are worse than no metrics.
3. **The self-built tools lead and the Payoneer systems corroborate.** Ordering
   is the argument, not a matter of taste.
4. **A single project must survive being sent on its own** with its own URL,
   its own preview card, and enough context to make sense cold.
5. **Write about decisions, not deliverables.** What was inherited, what was
   decided, and why.
