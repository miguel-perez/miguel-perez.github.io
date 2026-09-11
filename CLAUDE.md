# Working on miguel.design

README.md covers the layout, local build, front matter, and how a study is released. This file carries the conventions that are not derivable from the code. Facts about what each case study may say live in the career register at `~/Git/captain/docs/career-register/` (`portfolio-site.md` maps studies to sources; each `work/*.md` carries its own publication constraints). Nothing about this site should live only in a Claude memory.

## How the site is built and released

- A "feature flag" is an unlinked page. `draft: true` in front matter gives noindex and keeps the page out of the sitemap; release means dropping the flag and linking it from the homepage. No preview toggles, registries, or gate scripts.
- Each case study gets a new design in the client's brand ("the store stays, the street changes"). Duplication across pages is fine. A later methods deep dive keeps the homepage styling.
- Jekyll is welcome where it earns its place (front matter, head include, layouts, Liquid sitemap) because GitHub Pages runs it anyway. No static-site generator for content, no import scripts, no design runtime. The homepage is plain HTML.
- `theme: null` in `_config.yml` stops Pages injecting jekyll-theme-primer.
- Keep additions to the minimum Jekyll needs; propose simplifications before mechanisms. The site is small, bespoke, and public; tooling residue would show.

## Editorial conventions for case studies

- Pages tell a story; they are not evidence dossiers. No source annotations ("on file", "self-reported", author citations in the methods line), no hedging asides, no separate "what this account can't claim" section. Say the right thing where the claim is made, plus a colophon.
- Cut prose hard. One visual motif per page (the flock stayed in the Inovalon lab figure, so its hero got a different piece).
- Heroes are graphical, not bare, and never use client logos. Animations must be real (a proper boids simulation, not a wiggle), loop in case the reader misses them, and respect `prefers-reduced-motion`.
- Show both states side by side rather than behind toggles; very few readers will know to click. Where a toggle is unavoidable, one toggle, no sub-controls. Budget models are shown static. Before/after uses colour to mark what was removed and added; sliders hide both ends.
- No sticky side rail; essential facts embed in the hero.
- Testimonials by role, never name. Numbers carry their qualifier inline ("modeled", "2019 plan").
- Small samples get raw counts, not percentages or averages.
- Test every change at 1440, 900, and 390 before reporting it done.

## Local verification loop

Jekyll only runs under Homebrew Ruby 3.3; system Ruby has no gems.

```sh
PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH bundle exec jekyll build
python3 -m http.server 8931 --directory _site
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --screenshot=out.png --window-size=1440,11000 --virtual-time-budget=9000 http://localhost:8931/work/<slug>/
```

- Heights past ~9600 work. Run captures one at a time; back-to-back launches silently fail.
- Chrome clamps the window to about 500px wide, so `--window-size=390,...` renders a 500px layout cropped. For a true phone viewport, drop a wrapper into `_site` with `<iframe src="/work/<slug>/" style="width:390px;height:14000px;border:0">` and screenshot that. The next build removes it.
- `requestAnimationFrame` is throttled to about two frames in headless capture, so canvas animations show their settled state. Sticky and fixed elements render at their resting position in full-page shots; to see a sticky header over content, inject `.nav{position:fixed!important}` in a `<style>` before `</body>` (a style injected into `<head>` is overridden by the page's own later `<style>`).
- No PIL. Crop with `sips -c <h> <w> --cropOffset <y> <x> in.png --out out.png`. Offset 0 is treated as unset and crops from the centre; use 1.
- Interactive states (a toggle's other view, a canvas mode) can be previewed by sed-ing a variant copy of the built page in `_site`.
- Measure computed geometry with an injected probe script rather than eyeballing: figure widths, grid stability across animation cycles, hidden-row counts, JS errors.

## Converting a Claude Design export

Exports (`~/Downloads/...dc.html`, or a bundled `.html` with `__bundler/manifest` and `__bundler/template` scripts) are converted by hand, once, with no residue of the tool in the shipped HTML. Never commit a raw export; never add a script that re-imports.

- Keep only the body of `<x-dc>`. Drop `<x-dc>`, `<helmet>` (move its `<style>` into the page's own), `<script type="text/x-dc">`, `<script src="./support.js">`, and Google Fonts `<link>`s (faces go in front matter `fonts:`).
- Remove `data-screen-label`, `hint-placeholder-*`, `data-dc-*`.
- `sc-camel-view-box` → `viewBox` and similar; `style-hover="…"` → a class with a `:hover` rule; `<sc-if>`, `<sc-for>`, `{{ }}` → static content.
- Rewrite `Homepage%20v2.dc.html[#…]` links to `/`, `/#methods`, `/#work`, `/#talk`. Nav order is Methods · Work · Contact.
- Rewrite inline styles as classes in a page-level `<style>`; apply the client's street tokens; keep Fira Code labels and Instrument Serif body.
- Bundled boards embed fonts as base64 in the manifest. Extract by decoding `data`, checking the `wOF2` magic, naming `<face>-<subset>.woff2`, and copying Google's per-weight `@font-face` blocks with local URLs.
- Residue check on the build, which must return nothing:

```sh
grep -rlE "x-dc|sc-[a-z]+-|data-screen-label|hint-placeholder|DCLogic|support\.js|fonts\.googleapis|unpkg\.com|primer|Jekyll" _site
```

## Known state

- The homepage work list has seven rows tagged "Employer" with no corresponding filter chip.
- No study sets `image:` in front matter yet, so shared links get no preview card.
