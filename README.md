# miguel.design

Static site, built by GitHub Pages with Jekyll from `main`. Plain HTML, CSS, and inline SVG; no JavaScript framework, no theme, no plugins. Fonts are self-hosted under `assets/fonts/`.

## Layout

```text
_config.yml            site url, exclusions, default layout for work/
_includes/head.html    metadata from front matter: title, description, canonical, social cards, noindex for drafts, fonts
_includes/person.html  Person structured data (JSON-LD), emitted on pages with `person: true`
_includes/footer.html  the shared footer, with the More work row over the released studies
_includes/study-*.html the parts of a case study that every study has: the meta line, the facts rail, the numbers strip,
                       the outline, an act's label and heading, its methods line, the colophon (see Case studies)
_layouts/site.html     head + the site header and footer, for the homepage and pages that share its styling
_layouts/study.html    head + nav + <main> + footer for a case study; links study.css and study.js
index.html             homepage; the work filters are assets/js/work-filter.js
resume/index.html      the résumé, linked from the footer; its print stylesheet is the source of the PDF below
assets/miguel-perez-holdsworth-resume.pdf   printed from /resume/ (see Résumé PDF)
work/<slug>/index.html one case study per folder; images alongside in img/
assets/css/site.css    homepage styling shared through the site layout
assets/css/study.css   the store shared by every case study; a study sets its street as custom properties on body
assets/js/study.js     plays a figure's entrance animations when it comes on screen and rewinds them when it leaves
assets/css/fonts.css   Fira Code and Instrument Serif, used everywhere
assets/css/fonts/      one stylesheet per additional face a study needs, e.g. source-sans-3.css
sitemap.xml            generated from the pages; drafts are skipped
```

## Local build

Uses the same gem set as GitHub Pages (Ruby 3.3).

```sh
brew install ruby@3.3
export PATH="$(brew --prefix ruby@3.3)/bin:$PATH"
gem install bundler
bundle config set --local path vendor/bundle
bundle install
LANG=en_US.UTF-8 bundle exec jekyll serve --livereload   # http://localhost:4000
```

## Case studies

Each study is a page in its client's visual language. The store stays constant across studies and lives in `assets/css/study.css`: the wordmark and nav type, hairlines, Fira Code labels, Instrument Serif body, the number strip, the facts rail, figure numbering, and the colophon. The street changes: the client's published colour tokens and headline face, set as custom properties on `body` in the page's own `<style>` (`--ink`, `--ink-rgb`, `--text`, `--muted`, `--accent`, `--accent-rgb`, `--head`, `--head-weight`; `--nav-*` and `--hd-*` when the nav or the header block inverts; `--footer-*` for the footer). The rest of a page's `<style>` is its own figures. One accent per page; an accent that falls below 4.5:1 against its background is used at display sizes only.

Front matter carries the page data, and the `study-*` includes render the parts every study has from it:

```yaml
---
title: "Headline as it appears on the page"
client: "Client"            # the label in the footer's More work row
description: "The lede, used for the description and social cards."
draft: true                 # noindex, left out of the sitemap, not linked anywhere
fonts: [source-sans-3]      # extra faces, one stylesheet each under assets/css/fonts/
image: /work/<slug>/img/card.png   # optional social card
engagement: "Client, via Agency"   # the meta line, with period and read (minutes)
period: "October to December 2021"
read: 10
facts: [{k: Team, v: "…"}, {k: Role, v: "…"}, {k: Timeline, v: "…"}]
numbers: [{n: "10", s: "what the number counts"}, …]
acts:                       # one per act; ids are act-1…, the outline is generated
  - {where: "Client", when: "October 2021", title: "A six-word heading.", methods: [a, b]}
after: "The heading of the Afterwards section."
colophon: "What is withheld, what is redrawn, what is simulated."
---
```

In the page: `{% include study-meta.html %}`, `{% include study-facts.html %}` and `{% include study-numbers.html %}` in the header; `{% include study-outline.html %}` after Fig. 1; each act opens with `{% include study-act.html n=1 %}` and closes with `{% include study-methods.html n=1 %}`; `{% include study-colophon.html %}` ends the Afterwards section. The hero art, the h1 with its `<em>`, and every figure stay in the page.

A page with front matter runs through Liquid, so a literal `{{` or `{%` in page text or inline scripts needs `{% raw %}...{% endraw %}` around it.

### Releasing a study

A draft is reachable at its URL for review but is not linked, indexed, or listed. To release it:

1. Remove `draft: true` from the page's front matter.
2. Add the case-study link to that entry in the homepage work list; the link text says what the study holds.
3. Commit and push. The sitemap and the robots meta follow from the front matter.

## Résumé PDF

`assets/miguel-perez-holdsworth-resume.pdf` is the résumé page printed by headless Chrome, so the page and the PDF cannot drift apart. After editing `resume/index.html`:

```sh
bundle exec jekyll build
python3 -m http.server 8931 --directory _site &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf=assets/miguel-perez-holdsworth-resume.pdf http://localhost:8931/resume/
```

It is condensed from the career register's master résumé and should stay at two Letter pages (`pdfinfo` reports `Pages: 2`); the print rules at the top of `resume/index.html` set the sizes. The footer links to `/resume/` from every page.
