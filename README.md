# yoheinakajima.com

A zero-build, single-page personal website for Yohei Nakajima.

## Structure

- `index.html` — semantic page content and metadata
- `assets/base.css` — visual system, layout, hero, and shared components
- `assets/sections.css` — project, investment, history, talk, and publishing sections
- `assets/responsive.css` — responsive and reduced-motion behavior
- `assets/site.js` — progressive enhancement for reveal states, scroll progress, active navigation, and status text
- `favicon.svg` — site icon
- `robots.txt` / `sitemap.xml` — basic search indexing support
- `.nojekyll` — allows direct static hosting on GitHub Pages

## Preview locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

The site is platform-neutral static HTML. Point the host at the repository root. For GitHub Pages, choose **Deploy from a branch**, select `main`, and publish from `/ (root)`. Add the custom domain separately in Pages settings after DNS is ready.
