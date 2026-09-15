# miguel.design

Static site, built by GitHub Pages with Jekyll from `main`. Plain HTML, CSS, and inline SVG; no JavaScript framework, no theme, no plugins. Fonts are self-hosted under `assets/fonts/`.

## Layout

```text
_config.yml            site url, exclusions, default layout for work/
_includes/head.html    metadata from front matter: title, description, canonical, social cards, noindex for drafts, fonts
_includes/person.html  Person structured data (JSON-LD), emitted on pages with `person: true`
_layouts/site.html     head + the site header and footer, for the homepage and pages that share its styling
_layouts/study.html    head + the page's own body (each case study owns its markup and CSS)
index.html             homepage; the work filters are assets/js/work-filter.js
resume/index.html      the one-page résumé; its print stylesheet is the source of the PDF below
assets/miguel-perez-holdsworth-resume.pdf   printed from /resume/ (see Résumé PDF)
work/<slug>/index.html one case study per folder; images alongside in img/
assets/css/site.css    homepage styling shared through the site layout
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

Each study is a self-contained page in its client's visual language. The store stays constant across studies: the wordmark and nav type, hairlines, Fira Code labels, Instrument Serif body, the number strip, the facts rail, figure numbering, and the closing "what this account can't claim" block. The street changes: the client's published colour tokens and headline face. One accent per page; an accent that falls below 4.5:1 against its background is used at display sizes only.

Front matter carries the page data:

```yaml
---
title: "Headline as it appears on the page"
description: "The lede, used for the description and social cards."
draft: true                 # noindex, left out of the sitemap, not linked anywhere
fonts: [source-sans-3]      # extra faces, one stylesheet each under assets/css/fonts/
image: /work/<slug>/img/card.png   # optional social card
---
```

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

It must stay one page (`pdfinfo` reports `Pages: 1`); the print rules at the top of `resume/index.html` set the sizes.
