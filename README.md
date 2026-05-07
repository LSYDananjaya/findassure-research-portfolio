# FindAssure Research Portfolio

FindAssure is a research portfolio and system showcase for an AI-powered, privacy-preserving lost-and-found workflow built for institutional environments. The site presents the project narrative, system architecture, research methodology, mobile prototype, and team responsibilities behind the FindAssure final year research project.

## Overview

Campus lost-and-found workflows often depend on manual browsing, incomplete descriptions, uncertain indoor locations, and early disclosure of sensitive contact details. FindAssure reframes recovery as a progressive evidence pipeline:

- **Capture** found-item photos, structured indoor location labels, category signals, and private finder answers.
- **Match** owner queries using visual evidence, hybrid semantic retrieval, keyword overlap, and confidence-aware location expansion.
- **Verify** ownership through item-specific questions, video-answer transcripts, semantic scoring, and rule-based checks.
- **Protect** finder details until verification and administrator review justify a secure handover.

## Site Sections

- **Home**: high-level research story, mobile preview, core contributions, and recovery logic.
- **Work**: service-oriented architecture, module responsibilities, and animated workflow.
- **Research**: methodology blocks, techniques, evaluation goals, and governance themes.
- **Team**: project-member responsibilities, contact channels, portfolio links, and owned components.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui primitives
- Framer Motion
- Anime.js
- Lenis smooth scrolling
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  assets/                 iPhone showcase screenshots
  components/             Layout, navigation, workflow, and UI components
  content/                Central portfolio copy and team data
  hooks/                  Motion and UI hooks
  lib/                    Animation and utility helpers
  pages/                  Home, Work, Research, Team, and fallback routes
  test/                   Vitest coverage for content and routing expectations
public/
  logo.png                Site logo and social preview image
  robots.txt              Search crawler directives
  sitemap.xml             Static sitemap for main portfolio routes
```

## SEO Notes

The site includes:

- Descriptive title and meta description for the FindAssure research portfolio.
- Open Graph and Twitter card metadata.
- Canonical route metadata in `index.html`.
- `robots.txt` and `sitemap.xml` for static route discovery.
- A PNG favicon and social preview image.

The canonical URL and sitemap currently target `http://yehara.me/findassure-research-portfolio/`, which is the GitHub Pages URL reported for this repository.

## Research Keywords

FindAssure, AI lost and found, semantic retrieval, image processing, object recognition, indoor location reasoning, ownership verification, secure handover, fraud-aware review, SLIIT final year research.

## Team

- Yehara Dananjaya — Image Processing Lead
- Osanda Muthukumarana — Semantic Matching Lead
- Pawara Sasmina — Verification & Security Lead
- Sankalani Senanayaka — Analytics & Governance Lead

## License

This project is part of an academic research portfolio. Add a project license before distributing or reusing the source code outside the research team.
