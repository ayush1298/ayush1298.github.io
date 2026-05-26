# Personal site (GitHub Pages)

## Layout

- **Home** (`index.html`): left sidebar jumps to About, News, Publications, Experience. Top bar only links to other pages.
- **Top bar** (all pages): Projects · Contributions · Reading + email / GitHub / LinkedIn
- **Separate pages**: `projects.html`, `contributions.html`, `reading.html`

## Content

| File | Section |
|------|---------|
| `content/site.json` | Name, intro, nav, links |
| `content/news.json` | One-line news (`date`, `text`, `url`) |
| `content/publications.json` | Academic-style publication list |
| `content/experience.json` | Roles |
| `content/projects.json` | Projects page |
| `content/contributions.json` | MTEB PRs, etc. |
| `content/reading.json` | Blog repos + recommended articles |


## Deploy

GitHub Pages → branch `main`, folder `/ (root)`.
