# Ran Segal — Freelance Portfolio Design

## Summary

A clean, warm, single-page portfolio showcasing ~6 freelance projects. Static HTML + CSS, no framework. Easy to edit and extend.

## Header

- **Name**: "Ran Segal" — large, confident typography
- **Tagline**: "Designing experiences that feel right." — lighter weight, below name
- No navigation, no logo, no extra elements

## Project Cards

Each project is a full-width section containing:

1. **Title** — project name
2. **Description** — 1-2 sentence summary
3. **Details grid** (2-column on desktop, stacked on mobile):
   - Overview
   - Challenge
   - Solution
   - Results
4. **Horizontal scrollable image strip** — drag/swipe to browse, subtle scroll indicators

## Visual Direction: Warm & Personal

- Background: off-white/cream (`#FAF8F5`)
- Text: warm charcoal (`#2C2C2C`), not pure black
- Headings: friendly serif or rounded sans-serif (e.g., `DM Serif Display` or `Plus Jakarta Sans`)
- Body: clean sans-serif (`Inter` or system font)
- Accent: warm muted tone for hover states and scroll indicators
- Generous whitespace between projects
- Subtle dividers or spacing between project blocks

## Page Structure

```
[Header: Name + Tagline]

[Project 1: Title, Description, Details Grid, Image Strip]
[Project 2: Title, Description, Details Grid, Image Strip]
...
[Project 6: Title, Description, Details Grid, Image Strip]
```

No footer. No contact section. Page ends after last project.

## Technical Approach

- **Single HTML file** with embedded CSS (or a separate `style.css`)
- No JavaScript framework — vanilla JS only for scroll behavior if needed
- Google Fonts for typography
- Responsive: works on desktop, tablet, mobile
- Images served from `/images/project-name/` folders

## Easy Editing

- Each project wrapped in `<!-- PROJECT: Name -->` comments
- Copy/paste a project block to add a new one
- Change text and image paths — done
- Template comment block at the bottom of the HTML for reference

## No Contact Section

Page ends cleanly after the last project.
