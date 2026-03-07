# Ran Segal Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clean, warm single-page freelance portfolio with 6 placeholder projects, horizontal scrollable images, and easy-to-edit HTML structure.

**Architecture:** Single HTML file with a separate CSS file. No framework. Vanilla JS for horizontal scroll drag behavior. Google Fonts for typography. Responsive via CSS Grid and media queries.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Google Fonts (DM Serif Display + Inter)

---

### Task 1: Project scaffolding and base HTML

**Files:**
- Create: `index.html`
- Create: `style.css`

**Step 1: Create index.html with base structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ran Segal — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <h1 class="header__name">Ran Segal</h1>
    <p class="header__tagline">Designing experiences that feel right.</p>
  </header>

  <!-- PROJECTS -->
  <main class="projects">
  </main>

</body>
</html>
```

**Step 2: Create style.css with CSS custom properties and base styles**

```css
:root {
  --color-bg: #FAF8F5;
  --color-text: #2C2C2C;
  --color-text-light: #6B6560;
  --color-accent: #C4896E;
  --color-divider: #E8E4E0;
  --font-heading: 'DM Serif Display', serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --spacing-section: 6rem;
  --max-width: 1100px;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
```

**Step 3: Add header styles to style.css**

```css
/* --- Header --- */
.header {
  padding: 5rem 2rem 4rem;
  max-width: var(--max-width);
  margin: 0 auto;
}

.header__name {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.header__tagline {
  font-size: 1.125rem;
  color: var(--color-text-light);
  margin-top: 0.75rem;
  font-weight: 400;
}
```

**Step 4: Open in browser to verify header renders**

Open `index.html` in browser. Expected: cream background, "Ran Segal" in serif, tagline below in lighter gray.

---

### Task 2: Single project card HTML + CSS

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Step 1: Add one project block to index.html inside `<main class="projects">`**

```html
    <!-- PROJECT: Sample Project -->
    <article class="project">
      <div class="project__info">
        <h2 class="project__title">Project Name</h2>
        <p class="project__description">A short 1-2 sentence description of the project and what it involved.</p>

        <div class="project__details">
          <div class="project__detail">
            <h3>Overview</h3>
            <p>What this project is about and who it was for.</p>
          </div>
          <div class="project__detail">
            <h3>Challenge</h3>
            <p>The problem or constraint that needed solving.</p>
          </div>
          <div class="project__detail">
            <h3>Solution</h3>
            <p>How the design addressed the challenge.</p>
          </div>
          <div class="project__detail">
            <h3>Results</h3>
            <p>The outcome and impact of the work.</p>
          </div>
        </div>
      </div>

      <div class="project__images">
        <div class="project__images-track">
          <img src="https://placehold.co/800x500/E8E4E0/6B6560?text=Image+1" alt="Project image 1">
          <img src="https://placehold.co/800x500/E8E4E0/6B6560?text=Image+2" alt="Project image 2">
          <img src="https://placehold.co/800x500/E8E4E0/6B6560?text=Image+3" alt="Project image 3">
          <img src="https://placehold.co/800x500/E8E4E0/6B6560?text=Image+4" alt="Project image 4">
        </div>
      </div>
    </article>
    <!-- /PROJECT: Sample Project -->
```

**Step 2: Add project card styles to style.css**

```css
/* --- Projects --- */
.projects {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.project {
  padding: var(--spacing-section) 0;
  border-top: 1px solid var(--color-divider);
}

.project:last-child {
  padding-bottom: 4rem;
}

.project__title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 0.75rem;
}

.project__description {
  font-size: 1.0625rem;
  color: var(--color-text-light);
  max-width: 600px;
  margin-bottom: 2.5rem;
}

/* Details grid */
.project__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.project__detail h3 {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.project__detail p {
  font-size: 0.9375rem;
  line-height: 1.65;
}
```

**Step 3: Add horizontal scrollable image strip styles**

```css
/* Image strip */
.project__images {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  scrollbar-width: none;
  margin: 0 -2rem;
  padding: 0 2rem;
}

.project__images::-webkit-scrollbar {
  display: none;
}

.project__images-track {
  display: flex;
  gap: 1rem;
  width: max-content;
}

.project__images-track img {
  height: 320px;
  width: auto;
  border-radius: 8px;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}
```

**Step 4: Verify in browser**

Open `index.html`. Expected: header + one project card with title, description, 4 detail blocks in 2-column grid, and horizontally scrollable placeholder images.

---

### Task 3: Horizontal scroll drag behavior (JS)

**Files:**
- Modify: `index.html` (add script tag)

**Step 1: Add vanilla JS drag-to-scroll at the bottom of `<body>` in index.html**

```html
<script>
  document.querySelectorAll('.project__images').forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', e => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  });
</script>
```

**Step 2: Verify drag scrolling works in browser**

Open page, try clicking and dragging the image strip. It should scroll left/right smoothly.

---

### Task 4: Responsive styles

**Files:**
- Modify: `style.css`

**Step 1: Add responsive breakpoints to style.css**

```css
/* --- Responsive --- */
@media (max-width: 768px) {
  .header {
    padding: 3rem 1.5rem 2.5rem;
  }

  .projects {
    padding: 0 1.5rem;
  }

  .project {
    padding: calc(var(--spacing-section) * 0.6) 0;
  }

  .project__details {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project__images {
    margin: 0 -1.5rem;
    padding: 0 1.5rem;
  }

  .project__images-track img {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 2rem 1.25rem 2rem;
  }

  .projects {
    padding: 0 1.25rem;
  }

  .project__images {
    margin: 0 -1.25rem;
    padding: 0 1.25rem;
  }

  .project__images-track img {
    height: 200px;
  }
}
```

**Step 2: Verify responsive behavior**

Resize browser window. Expected: details grid stacks to single column below 768px, images shrink, padding adjusts.

---

### Task 5: Duplicate to 6 placeholder projects

**Files:**
- Modify: `index.html`

**Step 1: Copy the project block 5 more times**

Duplicate the `<!-- PROJECT: ... -->` block inside `<main>` to have 6 total projects. Give each a different placeholder name:

1. Brand Refresh — Startup Co
2. Mobile App Design — HealthTrack
3. Website Redesign — Artisan Bakery
4. Dashboard UI — DataFlow
5. Packaging Design — Bloom Tea
6. Campaign Visuals — Summit Festival

Update titles, descriptions, and detail text for each with realistic placeholder content.

**Step 2: Verify all 6 render correctly**

Scroll through page. Each project should have its own section with divider, details grid, and image strip.

---

### Task 6: Add project template comment

**Files:**
- Modify: `index.html`

**Step 1: Add a commented-out template block at the bottom of `<main>`**

```html
    <!--
    =============================================
    PROJECT TEMPLATE — Copy this block to add a new project.
    Place it inside <main class="projects">.
    =============================================

    <article class="project">
      <div class="project__info">
        <h2 class="project__title">Project Name</h2>
        <p class="project__description">Short description here.</p>

        <div class="project__details">
          <div class="project__detail">
            <h3>Overview</h3>
            <p>...</p>
          </div>
          <div class="project__detail">
            <h3>Challenge</h3>
            <p>...</p>
          </div>
          <div class="project__detail">
            <h3>Solution</h3>
            <p>...</p>
          </div>
          <div class="project__detail">
            <h3>Results</h3>
            <p>...</p>
          </div>
        </div>
      </div>

      <div class="project__images">
        <div class="project__images-track">
          <img src="images/project-name/1.jpg" alt="Description">
          <img src="images/project-name/2.jpg" alt="Description">
          <img src="images/project-name/3.jpg" alt="Description">
        </div>
      </div>
    </article>

    =============================================
    -->
```

**Step 2: Final verification**

Full page check: header, 6 projects, scrollable images, responsive layout, drag scroll. Page ends cleanly after last project.

---

### Task 7: Initialize git repo and commit

**Step 1: Initialize git**

```bash
cd /Users/rannsegal/Claude/ran-portfolio
git init
```

**Step 2: Commit all files**

```bash
git add index.html style.css CLAUDE.md docs/
git commit -m "feat: initial portfolio — header, 6 project cards, horizontal scroll"
```
