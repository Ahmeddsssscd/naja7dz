# Najaح

> La plateforme éducative qui aide ton enfant à réussir, du primaire au Bac. En arabe, en français.

**Live:** [naja7dz.com](https://naja7dz.com) *(once deployed)*

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v3** with full Najaح brand tokens
- **next-intl** for FR + AR with native RTL
- **Supabase** (Postgres + Auth + Storage) — wired up in Session 3
- **Vercel** hosting + **GitHub Actions** CI

## Project structure

```
najahdz/
├─ src/
│  ├─ app/
│  │  ├─ [locale]/        Localized routes (fr, ar)
│  │  │  ├─ layout.tsx    Root layout with fonts + i18n provider
│  │  │  ├─ page.tsx      Landing page
│  │  │  ├─ inscription/  Signup (Phase 1)
│  │  │  ├─ connexion/    Login (Phase 1)
│  │  │  └─ not-found.tsx 404
│  │  └─ globals.css      Tailwind + custom components
│  ├─ components/         Reusable UI (Logo, LangSwitch, Icon)
│  ├─ i18n/               next-intl config (routing, request)
│  └─ middleware.ts       Locale routing middleware
├─ messages/
│  ├─ fr.json             French copy (default)
│  └─ ar.json             Arabic copy (RTL)
├─ preview/               Static HTML mockups (design reference, not deployed)
├─ tailwind.config.ts     Brand tokens — DO NOT FREESTYLE COLORS
└─ STRUCTURE.md           Full site map (96 pages)
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars (then fill in real values from Supabase)
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — French (default).
Open [http://localhost:3000/ar](http://localhost:3000/ar) — Arabic with full RTL.

## Brand discipline

These rules are non-negotiable:

- **Colors**: only navy `#0F1B33`, gold `#D4A72C`, pale-blue `#E8EDF5`, cream `#FAF9F6`, white. **Two colors max** per screen.
- **Fonts**: Poppins (Latin) + Tajawal (Arabic). Loaded via `next/font` for performance.
- **Icons**: Lucide-style line icons, 2px stroke (in `src/components/Icon.tsx`).
- **Spacing**: 8-point grid (8/16/24/32/48/64/96 px).
- **Radius**: buttons 8 · inputs 8 · cards 12 · modals 16 · kid-mode 24+.
- **Mobile-first**: design at 380px, expand to 1200px max.
- **Bilingual**: every screen works in LTR (fr) AND RTL (ar). Test both.
- **Inspiration**: [kezakoo.com](https://kezakoo.com) — clean, simple, education-focused.
- **Avoid**: gradients, heavy shadows, "AI glow," generic SaaS look.

## Roadmap

See [STRUCTURE.md](./STRUCTURE.md) for the full site map.

| Stage | Sessions | What ships |
|---|---|---|
| Foundation | 1–2 | Live site at naja7dz.com + full marketing pages |
| Auth | 3–4 | Parent signup, onboarding, dashboard shell |
| Core product | 5–11 | Quiz Engine, Tutor, Bac/BEM |
| Kids Universe | 12–14 | ~15 games for ages 5–10 |
| Writing + Parent | 15–17 | Writing skills + full parent dashboard |
| Social + Money | 18–19 | Communities + Chargily payments |
| Admin + AI + Launch | 20–24 | Admin panel + real AI + soft launch |

## Contributing

We follow a strict commit convention:
- `feat(quiz): add adaptive difficulty`
- `fix(parent): correct weekly stats query`
- `docs(readme): update setup instructions`

One feature per commit. Small, clear, reviewable.

## License

Proprietary. © 2026 Najaح.
