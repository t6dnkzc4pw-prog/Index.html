# MADIA

> *The silent luxury of warm bread.*

Marketing site for **MADIA** — a handcrafted Italian wooden object that silently
preserves and warms bread. Designed for superyachts, private jets, lakeside
villas, and high-end suites.

Built with Next.js 14 (App Router), TypeScript strict, Tailwind, GSAP +
ScrollTrigger, Lenis smooth scroll, Framer Motion, next-intl and Resend.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY when ready
npm run dev
```

Open <http://localhost:3000> → redirects to `/en`.

### Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next/ESLint
- `python3 scripts/generate-placeholders.py` — regenerate placeholder imagery

---

## Image attachments

Drop the final photography here, replacing the dark warm placeholders that
`scripts/generate-placeholders.py` ships by default:

| File                              | Subject                                                          |
|-----------------------------------|------------------------------------------------------------------|
| `public/images/hero.jpg`          | Yacht / breakfast at sea — stewardess presenting open MADIA box  |
| `public/images/scenes/yacht.jpg`  | Scene I — on board, breakfast at sea                             |
| `public/images/scenes/villa.jpg`  | Scene II — lakeside villa breakfast (Lake Como mood)             |
| `public/images/scenes/suite.jpg`  | Scene III — five-star suite at sunset (Portofino mood)           |
| `public/images/scenes/jet.jpg`    | Scene IV — private jet cabin, service as gesture                 |
| `public/images/product-grid.jpg`  | Product mosaic (closed/open MADIA, marble + yacht)               |
| `public/og-image.jpg`             | 1200×630 OpenGraph hero                                          |

Suggested export: AVIF/WebP/JPEG, sRGB, ~85 quality, long edge 2000–2400px.

---

## Architecture

```
src/
  app/[locale]/        Localized routes (en, it). `layout.tsx` injects fonts, providers.
  app/api/inquiry/     POST endpoint — Zod-validated, Resend, in-memory rate-limit.
  components/
    layout/            LenisProvider, LanguageSwitcher, Logo
    sections/          Preloader → Hero → Emotion → Sense → Scenes → Roots → Epilogue → Inquiry
    ui/                FadeIn, Parallax, EyebrowLabel
  i18n/
    config.ts          next-intl request config
    messages/          en.json, it.json
  lib/
    gsap.ts            registers ScrollTrigger
    useReducedMotion.ts  prefers-reduced-motion + mobile breakpoint hooks
  middleware.ts        Locale routing (/, /it, /en)
```

### Design tokens (`tailwind.config.ts`)

| Token                  | Hex       | Use                                |
|------------------------|-----------|------------------------------------|
| `bg-black`             | `#000000` | Primary background                 |
| `bg-deep`              | `#0a0a0a` | Alternate sections (Roots)         |
| `bg-warm`              | `#1a1410` | Warm accent box / Epilogue quote   |
| `text-primary`         | `#f5f1e8` | Warm white — never pure            |
| `text-secondary`       | `#a8a094` | Body / subdued copy                |
| `accent-amber`         | `#c89968` | Desaturated gold — focus, accents  |
| `accent-amber-soft`    | `#8a7050` | Wood-shadow accent                 |

Typography: **Cormorant Garamond** (display, weights 300–500, italic) and
**Inter** (sans, 300/400). Both loaded with `next/font` for zero FOUC.

---

## Motion strategy

- **Lenis** for smooth scrolling on desktop only. Disabled on `max-width: 768px`
  and on `prefers-reduced-motion: reduce`.
- **GSAP + ScrollTrigger** for hero parallax (image `-30%`, text `-8%` + slight
  opacity fade) and per-scene asymmetric parallax (factors `0.8 / 1.0 / 1.2 / 0.9`).
- **FadeIn** primitive (`y: 24` → `0`, opacity, `power3.out`, triggered once at
  `top 85%`) replaces ad-hoc tweens.
- `prefers-reduced-motion` short-circuits every animation to a plain fade-in,
  and `useIsMobile` cuts parallax to 30% of its desktop amplitude.

---

## Localization

`next-intl` with prefix routing — `/en` (default) and `/it`. The language
switcher is the only fixed UI; clicking it navigates between locale prefixes
while preserving the rest of the path. Add a locale by:

1. Append it to `locales` in `src/i18n/config.ts`.
2. Add a matching `src/i18n/messages/<locale>.json` file.

---

## Logo

`src/components/layout/Logo.tsx` exports `<Logo variant="mark" | "wordmark" | "lockup" />`.
Currently uses Cormorant Garamond for the wordmark and an SVG of concentric
growth-ring circles + keyhole silhouette for the mark. Both carry a
`// TODO: replace with custom font / final mark from designer` note.

`public/logo-mark.svg` is the standalone vector — used as favicon.

---

## Inquiry endpoint (`/api/inquiry`)

- Validates with `zod` (`name 2–120`, `email`, `message 10–4000`).
- Rate-limits to 3 requests / minute / IP (in-memory; swap for Upstash if you
  scale).
- Sends through Resend if `RESEND_API_KEY` is present, otherwise logs and
  returns `{ok: true, dev: true}` so local dev never breaks.
- Default `to` = `madiabox@gmail.com`; override with `INQUIRY_TO`.

```
.env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
INQUIRY_TO=madiabox@gmail.com
INQUIRY_FROM="MADIA <inquiry@madiabox.com>"
```

---

## Accessibility

- AA contrast on `accent-amber` over `bg-black` for large text only — body copy
  uses `text-primary` / `text-secondary` (both AAA-safe).
- Focus ring is a 1px `accent-amber` outline with 4px offset.
- All inputs have `sr-only` labels and explicit `aria-label`.
- Hero & scene images carry descriptive alt text.
- `prefers-reduced-motion` is honored everywhere.

---

## Performance notes

- Hero image: `priority`, `quality={90}`, `sizes="100vw"`.
- Scene images: lazy, `sizes="(max-width: 768px) 100vw, 50vw"`.
- Fonts: `next/font` self-hosted, `display: swap`.
- No headers, no menus — only one fixed element (language switcher).
- Target Lighthouse: 90+ Performance / Accessibility / SEO.
