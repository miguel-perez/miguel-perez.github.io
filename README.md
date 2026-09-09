# miguel.design

Static site, built by GitHub Pages with Jekyll from `main`. Plain HTML, CSS, and inline SVG; no JavaScript framework, no theme, no plugins. Fonts are self-hosted under `assets/fonts/`.

## Layout

```text
_config.yml            site url, exclusions, default layout for work/
_includes/head.html    metadata from front matter: title, description, canonical, social cards, noindex for drafts, fonts
_layouts/study.html    head + the page's own body (each case study owns its markup and CSS)
index.html             homepage
work/<slug>/index.html one case study per folder; images alongside in img/
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
2. Add the `Case study →` link to that entry in the homepage work list.
3. Commit and push. The sitemap and the robots meta follow from the front matter.
