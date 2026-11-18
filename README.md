# Arsenius Purbandono · Portfolio

Personal portfolio of a Flutter mobile developer, in English, Indonesian and Japanese.

**Live:** https://arsenius-portfolio.vercel.app

## Highlights

- Trilingual (EN / ID / JA), switchable in the page or with `?lang=en|id|ja`
- Project case studies with screenshots, a career timeline and certifications
- Downloadable CVs, including Japanese 履歴書 and 職務経歴書
- Print-ready PDF version of the whole site, generated from the print stylesheet
- Light and dark theme, responsive down to phone width
- Plain HTML, CSS and JavaScript: no framework, no build step

## Project structure

```
.
├── index.html              # single page
├── assets/
│   ├── css/styles.css      # screen + print styles
│   ├── js/
│   │   ├── i18n.js         # all copy (I18N, APPS, MODELS, SANDBOX)
│   │   ├── app.js          # rendering, language switch, interactions
│   │   └── daily.js        # "line of the day" widget
│   └── img/                # photo, OG image, favicon, logos/, shots/
├── cv/                     # CV downloads (stable public URLs)
├── pdf/                    # generated portfolio PDFs (stable public URLs)
├── scripts/build-pdf.sh    # regenerates pdf/
└── vercel.json             # cache headers
```

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Editing

- **Text:** edit `assets/js/i18n.js`. Every string exists in all three languages.
- **PDFs:** after changing text, run `bash scripts/build-pdf.sh` (needs Python and Google Chrome).

## Deployment

Every push to `main` is deployed by Vercel as a static site. `scripts/` and `promo/` are excluded by `.vercelignore`.

## Note

Work at Bapenda Jabar is described with the agency's permission. No source code or internal data from those projects is included.
