# Favored Online website (v2)

A focused rebuild of favoredonline.com around two things:

1. **Books**: the *Career Path in Tech* series and the free AI Business Growth Toolkit, sold through Selar (https://selar.com/m/favoredonline)
2. **AI solutions for businesses**: services, process, FAQ and a consultation request form

## Pages
| Route | What it is |
|---|---|
| `/` | Home: both offerings, about |
| `/books` | Bundle, the three books, free toolkit |
| `/ai-solutions` | Services, how we work, FAQ, consultation form |
| `/terms`, `/privacy` | Existing legal pages (carried over) |

Old links (`/solutions`, `/services`, `/solutions/terms`, `/contact`, …) redirect to the new pages; everything else goes to `/`.

## Editing content
All prices, Selar links, book details, services, FAQs and social links live in **`src/data/content.js`**.
Pre-order prices switch to regular prices automatically after `LAUNCH_DATE` (Nov 16, 2026).

## Consultation form
Submissions go to the same Google Form the old site's chatbot used, so responses keep landing in the same sheet.

## Run / deploy
```
npm install
npm run dev      # local
npm run build    # outputs to dist/
```
Deploys to Vercel as-is (`vercel.json` sets the Vite framework and SPA rewrites).

## Removed from the old site
Firebase, login, career platform, community, projects, events, badges, admin, email digests and the `/api` functions.
`public/sw.js` is now a kill switch that clears the old PWA cache for returning visitors.
