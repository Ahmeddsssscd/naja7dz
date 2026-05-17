# Najaح

> La plateforme éducative qui aide ton enfant à réussir, du primaire au Bac. En arabe, en français.

**Live:** [naja7dz.com](https://naja7dz.com)

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

## New machine / laptop setup

**Step 1 — Clone**
```bash
git clone https://github.com/Ahmeddsssscd/naja7dz.git
cd najahdz
```

**Step 2 — Install Node 20+ (if not already)**
```bash
node -v   # must be >= 20
# if not: https://nodejs.org  or  nvm install 20
```

**Step 3 — Install dependencies**
```bash
npm install
```

**Step 4 — Create `.env.local`**

Copy the example file and fill in the real values.
The values are the same as on your other machine (or find them in the Supabase & Chargily dashboards):
```bash
cp .env.example .env.local
# then open .env.local and paste the real keys
```

Required variables:
| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `CHARGILY_SECRET_KEY` | Chargily dashboard → API Keys |
| `CHARGILY_API_BASE` | `https://pay.chargily.net/test/api/v2` (or prod) |
| `CHARGILY_WEBHOOK_SECRET` | Chargily dashboard → Webhooks |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` for local dev |

**Step 5 — Run**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Health check

Visit [/api/health/db](http://localhost:3000/api/health/db) — it shows which DB tables are present.
If a protected page shows "Configuration requise", paste `database/SETUP.sql` into the Supabase SQL Editor and run it.

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
