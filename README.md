# Favored Online website

A books-only site for the *Career Path in Tech* series (Start, Get In, Grow), sold through our online store.

## Editing content
Prices, store links and book details live in `src/data/content.js`.
Pre-order prices switch to regular prices automatically after `LAUNCH_DATE` (Nov 16, 2026).

## Run / deploy
```
npm install
npm run dev      # local
npm run build    # outputs to dist/
```
Deploys to Vercel as-is (`vercel.json` sets Vite and SPA rewrites). Old links redirect to the homepage.
