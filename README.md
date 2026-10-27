# FRAME ZERO Portfolio

A static portfolio website for creative direction, music videos, and visual storytelling.

## Project structure

- `index.html` — website page and content structure.
- `styles/frame-zero-portfolio.css` — all website styling and responsive layout.
- `scripts/frame-zero-interactions.js` — small interactive behaviours.
- `assets/images/` — project photography, thumbnails, and visual assets.
- `assets/fonts/` — locally hosted font files, if added later.
- `assets/icons/` — logos and interface icons, if added later.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.

Keep files in the folder that matches their purpose. Create a clearly named subfolder when a category grows. Use descriptive filenames rather than names like `new-file`, `final-final`, or `test2`. Keep `index.html` at the repository root so static hosting can find the homepage. The site deliberately remains framework-free to keep Cloudflare deployment simple.

## Run locally

Open `index.html` in a browser. This is a static site and does not need a build step.

## Before publishing

- Replace the Instagram placeholder with the actual profile.
- Replace concept imagery and sample project descriptions with real work.
- Add a contact email when ready.

## Deployment

The repository includes a GitHub Pages workflow. For GitHub Pages, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

For Cloudflare Pages, connect this repository and use production branch `main`, framework preset `None`, no build command, and output directory `/` or `.` (the repository root containing `index.html`).