# Najaح — Feature Roadmap

Living document. Updated every session.

**Live site:** [naja7dz.com](https://naja7dz.com)
**Status:** Stage 1 (public site) ~85% done

---

## ✅ Done

### Stage 0 — Foundation
- [x] Next.js 15 + TypeScript (strict) + Tailwind v3
- [x] Bilingual: French + Arabic with native RTL
- [x] Brand tokens (navy, gold, cream, pale-blue) wired into Tailwind
- [x] Poppins + Tajawal fonts via next/font
- [x] Real Najaح logo (cropped from brand kit) via next/image
- [x] Favicon (browser tab) + apple-icon (iPhone home screen)
- [x] Supabase project + first migration (`early_access_signups`)
- [x] Server-only Supabase client + browser anon client
- [x] GitHub repo (private) + auto-deploy via Vercel
- [x] Custom domain naja7dz.com + SSL
- [x] Light + Dark mode with persistent toggle (next-themes)

### Stage 1 — Public site
- [x] Landing page (hero, trust strip, 3 steps, 6 features, pricing, FAQ, CTA, footer)
- [x] **Pricing standalone** (`/tarifs`) — 3 plans + feature comparison table
- [x] **FAQ standalone** (`/faq`) — categorized Q&A
- [x] **Pour les parents** (`/pour-les-parents`) — 6 trust pillars
- [x] **Contact** (`/contact`) — form + email + WhatsApp + hours
- [x] **Email-capture form** on landing → saves to Supabase waitlist
- [x] **Cookie banner** (Loi 18-07 informational)
- [x] **GitHub Actions CI** — typecheck + lint on every push/PR
- [x] 404 page on-brand
- [x] Placeholder pages for `/inscription` and `/connexion`

---

## 🚧 In progress / Next session

### Stage 1 — Public site polish (small leftover)
- [ ] Blog index + first SEO articles ("Comment réussir le Bac", "BEM 2026")
- [ ] About / Notre mission page (`/about`)
- [ ] Legal pages: Conditions, Confidentialité, Loi 18-07, Mentions
- [ ] Sitemap.xml + robots.txt
- [ ] Open Graph image (social share preview)

---

## ⏳ Stage 2 — Auth & Onboarding
- [ ] Real signup form (replace placeholder) — email + password + parent info
- [ ] Email verification with Resend
- [ ] Login form (real)
- [ ] Forgot / reset password flow
- [ ] Onboarding wizard: family info → add child → diagnostic quiz → welcome
- [ ] "Add another child" flow
- [ ] Phone number capture (optional)

## ⏳ Stage 3 — Parent Dashboard
- [ ] Dashboard home: KPI cards + child cards + activity feed
- [ ] Per-child profile: heatmap, trends, recommendations
- [ ] Activity feed (real-time)
- [ ] Weekly PDF report generator (FR + AR)
- [ ] AI insight card (mocked initially)
- [ ] Time limits + game locks
- [ ] Friend request approval flow
- [ ] Subscription management UI
- [ ] AI chat about a specific child
- [ ] Notification settings
- [ ] Email + WhatsApp report delivery

## ⏳ Stage 4 — Quiz Engine
- [ ] DB seed: grades (1AP–3AS), subjects, chapters
- [ ] Quiz screen (full-screen with hint, audio, explanations)
- [ ] AI quiz generation (mocked → real Claude later)
- [ ] Save attempts + scores + history
- [ ] "Yesterday's mistakes" review
- [ ] Adaptive difficulty
- [ ] Photo handwriting grading
- [ ] Per-subject progress tracking

## ⏳ Stage 5 — Tutor + Photo Help
- [ ] Tutor chat UI
- [ ] Conversation history sidebar
- [ ] "Re-explain differently" button
- [ ] Photo homework helper (camera, crop, step-by-step)
- [ ] Reaction buttons (helpful / not)

## ⏳ Stage 6 — Bac & BEM
- [ ] Exam paper uploader (admin)
- [ ] Browse + filter UI (year, filière, subject)
- [ ] AI-generated solutions + admin verification
- [ ] **Mock exam locked mode** (timed, no exit)
- [ ] In-exam help button
- [ ] Generate similar exam button
- [ ] Bac countdown page
- [ ] Submit motivational speech form
- [ ] Daily approved speech display

## ⏳ Stage 7 — Kids Universe (5–10)
- [ ] Kids home with fennec mascot + 4 huge tiles
- [ ] Color-by-numbers (Algerian themes + hidden math)
- [ ] Number Ninja arcade
- [ ] Shape Detective
- [ ] Counting Souk (Algerian market with dinars)
- [ ] Sudoku for kids (4×4 → 9×9)
- [ ] Memory grid
- [ ] Chess with adaptive AI
- [ ] Pattern puzzles
- [ ] Daily logic riddles
- [ ] Drawing-to-Story
- [ ] Time-telling (analog + prayer times)
- [ ] Manners & adab lessons
- [ ] Geography of 58 wilayas
- [ ] Quran memorization tracker
- [ ] Tafsir for kids

## ⏳ Stage 8 — Writing Skills
- [ ] Daily writing prompts
- [ ] Real-time AI feedback (mocked)
- [ ] Calligraphy practice with photo scoring
- [ ] Progress tracking

## ⏳ Stage 9 — Social & Community
- [ ] Study groups (5–10 members, invite-only)
- [ ] Group chat with AI moderation
- [ ] Group leaderboards
- [ ] Parent communities by wilaya
- [ ] Teacher community
- [ ] Profile public/private toggle
- [ ] Trophies on profile

## ⏳ Stage 10 — Payments
- [ ] Chargily Pay integration
- [ ] 4 plans wired (Élève, Famille, Pack Bac, Pack BEM)
- [ ] Webhook handling
- [ ] BaridiMob manual fallback
- [ ] Free tier rate limiting
- [ ] Subscription management for parents
- [ ] Refund handling

## ⏳ Stage 11 — Admin Dashboard
- [ ] Overview (MRR, signups, churn, alerts)
- [ ] User management (search, suspend, refund, message)
- [ ] Revenue & subscriptions
- [ ] Content manager (curriculum tree, exam uploads)
- [ ] AI Quality center (hallucination flags, prompt editor)
- [ ] Moderation queue
- [ ] Motivational speech approval
- [ ] Rewards program (vacation gifts)
- [ ] Support tickets inbox
- [ ] Analytics + wilaya map

## ⏳ Stage 12 — Real AI integration
- [ ] Replace all mocks with real Claude API
- [ ] Add Whisper for audio quizzes
- [ ] Add ElevenLabs for kids voice
- [ ] Redis caching of AI responses (cost control)
- [ ] SymPy math verification
- [ ] User flag → admin review pipeline

## ⏳ Stage 13 — Launch prep
- [ ] PWA: service worker + manifest + install prompt
- [ ] Push notifications
- [ ] Performance audit (Lighthouse > 90)
- [ ] Mobile responsiveness audit
- [ ] Security audit (RLS, env, headers)
- [ ] SEO: sitemap, structured data, meta tags
- [ ] Privacy Policy + Terms (lawyer review)
- [ ] Sentry error monitoring
- [ ] Plausible analytics
- [ ] Bug bash
- [ ] Soft launch to validation list

---

## How to read this

- **[x]** = shipped to production
- **[ ]** = not started yet
- Each stage builds on the previous one — we don't skip
- One stage = one to three sessions of focused work

Live status as of latest commit: see `git log --oneline | head`
