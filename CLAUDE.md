# Ran Segal — Freelance Portfolio

## Project Overview
Single-page freelance portfolio. Static HTML + CSS, no framework. Warm & personal visual tone.

## Structure
- `index.html` — main portfolio page
- `style.css` — styles (if separated)
- `images/` — project images organized by `/images/project-name/`
- `docs/plans/` — design docs

## Design Decisions
- Off-white/cream background (#FAF8F5), warm charcoal text (#2C2C2C)
- Google Fonts: serif for headings, sans-serif for body
- Each project is a self-contained HTML block with: title, description, details grid (Overview/Challenge/Solution/Results), horizontal scrollable image strip
- No framework, no build step — vanilla HTML/CSS/JS only
- Responsive: desktop, tablet, mobile

## Editing Projects
- Each project is wrapped in `<!-- PROJECT: Name -->` / `<!-- /PROJECT: Name -->` comments
- To add a project: copy an existing project block, update text and image paths
- Images go in `/images/project-name/` folder

## Conventions
- Keep CSS organized by section (header, projects, images, responsive)
- Use CSS custom properties for colors and spacing
- No unnecessary JavaScript — only for scroll/interaction behavior
