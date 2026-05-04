# Najaح — Complete Site Structure

Every page, organized by zone. This is the map of the entire product.

---

## 🌐 Public site (anyone visiting najahdz.com)

| URL | Page | Purpose |
|---|---|---|
| `/` | Landing | Convert visitors into signups |
| `/tarifs` | Pricing | Plans + comparison + FAQ |
| `/pour-les-parents` | For parents | Trust page: safety, methodology, testimonials |
| `/blog` | Blog index | SEO + thought leadership |
| `/blog/[slug]` | Blog article | Educational content |
| `/faq` | FAQ | Standalone full FAQ |
| `/contact` | Contact | Support form + email + WhatsApp |
| `/legal/conditions` | Terms | Required |
| `/legal/confidentialite` | Privacy | Loi 18-07 compliant |
| `/legal/mentions` | Legal notice | Required for Algerian sites |
| `/inscription` | Signup | Parent creates account |
| `/connexion` | Login | All roles |
| `/connexion/oublie` | Forgot password | Reset flow |
| `/verifier-email` | Email verify | Click-from-email landing |

---

## 👨‍👩‍👧 Parent zone (after login, role = parent)

| URL | Page | What it shows |
|---|---|---|
| `/parent` | Dashboard home | KPIs (study time, quizzes, average, streak) + per-child cards + weekly insight + activity feed |
| `/parent/enfants` | All children | Grid of child cards with quick stats |
| `/parent/enfants/[id]` | Child profile | Tabs: Vue d'ensemble · Matières · Quiz · Temps · Recommandations |
| `/parent/enfants/[id]/ajouter-controle` | Parental controls | Time limits, game locks, allowed features |
| `/parent/rapports` | Reports | List of weekly PDF reports per child |
| `/parent/rapports/[id]` | Report viewer | Inline PDF + email/WhatsApp resend |
| `/parent/abonnement` | Subscription | Current plan, billing history, manage |
| `/parent/abonnement/changer` | Change plan | Upgrade/downgrade flow |
| `/parent/notifications` | Notifications | Settings + history |
| `/parent/parametres` | Settings | Profile, language, password |
| `/parent/aide` | Help center | Articles + contact support |
| `/parent/conversation` | Chat about a child | Conversational interface to ask questions about a specific child |

---

## 🎓 Student zone — Teen 11–18 (role = student, age ≥ 11)

| URL | Page | What it shows |
|---|---|---|
| `/eleve` | Student home | Avatar, level, streak, today's missions, quick-access grid |
| `/eleve/matieres` | Subjects | Browse subjects for student's grade |
| `/eleve/matieres/[id]` | Subject home | Chapters + progress per chapter |
| `/eleve/matieres/[id]/[chapitre]` | Chapter | Content + start quiz button |
| `/eleve/quiz/[id]` | Quiz screen | Take a quiz (10 questions, hint, audio, explanations) |
| `/eleve/quiz/[id]/resultats` | Quiz results | Score, breakdown, weak areas, retake |
| `/eleve/quiz/erreurs-hier` | Yesterday's mistakes | Daily review quiz |
| `/eleve/tuteur` | Tutor home | List past conversations, start new |
| `/eleve/tuteur/[id]` | Tutor chat | Active conversation with reaction buttons |
| `/eleve/devoirs` | Homework helper | Photo upload + crop + step-by-step solution |
| `/eleve/bac` | Bac archive | Browse by year/filière/subject |
| `/eleve/bac/[id]` | Bac paper | Paper + AI-verified solution + similar exam button |
| `/eleve/bac/examen-blanc` | Mock Bac | Pre-exam warning + locked exam mode |
| `/eleve/bac/compte-a-rebours` | Bac countdown | Days remaining + daily speech + intensive plan |
| `/eleve/bac/discours` | Submit speech | Form to submit motivational speech |
| `/eleve/bem` | BEM archive | Same as Bac, for 4AM students |
| `/eleve/bem/examen-blanc` | Mock BEM | Locked exam mode |
| `/eleve/redaction` | Writing skills | Today's prompt + writing area + feedback |
| `/eleve/calligraphie` | Calligraphy | Trace letters, photo-based scoring |
| `/eleve/progres` | Progress | My stats, weak areas, recommendations |
| `/eleve/profil` | Profile | Avatar, trophies, level, settings |
| `/eleve/groupes` | Study groups | My groups + join group code |
| `/eleve/groupes/[id]` | Group page | Members, leaderboard, group chat |

---

## 🦊 Kids Universe — Ages 5–10 (role = student, age 5–10)

| URL | Page | What it does |
|---|---|---|
| `/petits` | Kids home | Big mascot fennec, 2x2 huge tiles, recent trophies |
| `/petits/coloriage` | Coloring designs | Grid of 1000+ Algerian-themed designs |
| `/petits/coloriage/[id]` | Color-by-numbers | Outlined design + numbered palette + hidden math |
| `/petits/maths` | Math games hub | Number Ninja, Shape Detective, Counting Souk |
| `/petits/maths/number-ninja` | Number Ninja | Arcade math game |
| `/petits/maths/shape-detective` | Shape Detective | Find shapes in real photos |
| `/petits/maths/souk` | Counting Souk | Virtual market with dinars |
| `/petits/logique` | Logic hub | Sudoku, Memory, Chess, Patterns |
| `/petits/logique/sudoku` | Kid sudoku | 4x4 → 9x9 progression |
| `/petits/logique/memoire` | Memory grid | Match pairs |
| `/petits/logique/echecs` | Chess | Adaptive AI opponent |
| `/petits/logique/motifs` | Pattern puzzles | Complete the pattern |
| `/petits/logique/enigme` | Daily riddle | One per day |
| `/petits/lecture` | Reading hub | Drawing-to-Story + read-along stories |
| `/petits/lecture/dessin` | Drawing-to-Story | Kid draws, story is generated |
| `/petits/lecture/[story-id]` | Story viewer | Illustrated story with audio narration |
| `/petits/monde-reel` | Real World hub | Time, manners, geography |
| `/petits/monde-reel/heure` | Time-telling | Analog clocks + prayer times |
| `/petits/monde-reel/adab` | Manners | Interactive lessons |
| `/petits/monde-reel/wilayas` | Geography | 58 wilayas through games |
| `/petits/quran` | Quran | Memorization tracker + Tafsir for kids |
| `/petits/trophees` | Trophies | Visual trophy shelf |

---

## 🧑‍🏫 Teacher zone (role = teacher)

| URL | Page | Purpose |
|---|---|---|
| `/enseignant` | Teacher home | Tools + community access |
| `/enseignant/outils` | Free tools | Worksheet generator, etc. |
| `/enseignant/communaute` | Teacher community | Posts, resources, discussion |
| `/enseignant/ressources` | Resource library | Shared materials |

---

## 🏘️ Communities (cross-role)

| URL | Page | Who can access |
|---|---|---|
| `/communaute/parents/[wilaya]` | Parent community | Parents from same wilaya |
| `/communaute/parents/[wilaya]/poster` | Create post | Parents only |
| `/communaute/enseignants` | Teacher community | Teachers only |

---

## 🛡️ Admin zone (role = admin only)

| URL | Page | What you do |
|---|---|---|
| `/admin` | Overview | MRR, signups, churn, alerts, queues |
| `/admin/utilisateurs` | Users | Search, filter, suspend, refund, message |
| `/admin/utilisateurs/[id]` | User detail | Profile, subscription, activity, payments |
| `/admin/revenus` | Revenue | MRR/ARR charts, revenue by plan, refunds |
| `/admin/abonnements` | Subscriptions | Active, churned, failed payments |
| `/admin/contenu/programme` | Curriculum | Tree editor: grade → subject → chapter |
| `/admin/contenu/examens` | Exam archive | Upload Bac/BEM PDFs + metadata |
| `/admin/contenu/solutions` | Solution review | Verify AI-generated solutions |
| `/admin/qualite` | Quality center | Hallucination flags, math mismatches |
| `/admin/qualite/prompts` | Prompt editor | Edit and A/B test system prompts |
| `/admin/moderation` | Moderation queue | Flagged messages, content, posts |
| `/admin/discours` | Speech approval | Queue of motivational speeches |
| `/admin/discours/[id]` | Speech preview | Preview as it appears under countdown |
| `/admin/recompenses` | Rewards program | Top students + testimonials + award gifts |
| `/admin/recompenses/[id]` | Award flow | Send gift + email + admin task |
| `/admin/support` | Support tickets | Inbox, assign, respond |
| `/admin/support/[id]` | Ticket detail | Conversation + canned responses |
| `/admin/analytique` | Analytics | DAU/WAU/MAU, retention, feature heatmap, wilaya map |
| `/admin/parametres` | Settings | System config, feature flags |

---

## 🔧 Cross-cutting (everywhere)

- **Bilingual**: all pages exist in FR (LTR) and AR (RTL). The user can flip at any time.
- **Mobile-first**: every page works at 380px first, then expands to desktop.
- **PWA**: installable on phones (Add to Home Screen). Works offline for cached content.
- **Notifications**: push (browser), email (Resend), WhatsApp (Twilio).
- **Payments**: Chargily Pay (CIB + EDAHABIA cards) + BaridiMob fallback.
- **Privacy**: Loi 18-07 compliant. No PII in URLs. Encrypted at rest.

---

## Page count summary

| Zone | Pages |
|---|---|
| Public site | 14 |
| Parent zone | 12 |
| Student zone (Teen) | 23 |
| Kids Universe (5–10) | 22 |
| Teacher zone | 4 |
| Communities | 3 |
| Admin zone | 18 |
| **Total** | **~96 unique pages** |

Many of these reuse the same components (cards, buttons, layouts), so the actual code is far smaller than the page count suggests.

---

## Build order (matches the 12-block roadmap)

1. **Block 1**: 1 page live (Coming Soon → Landing)
2. **Block 2**: +5 pages (full Public site)
3. **Block 3**: +6 pages (Auth + onboarding)
4. **Block 4**: +9 pages (AI Quiz + Tutor + Homework)
5. **Block 5**: +6 pages (Bac + BEM)
6. **Block 6**: +22 pages (Kids Universe)
7. **Block 7**: +2 pages (Writing skills)
8. **Block 8**: +12 pages (Parent dashboard)
9. **Block 9**: +7 pages (Social + community)
10. **Block 10**: +4 pages (Pricing + checkout flows)
11. **Block 11**: +18 pages (Admin)
12. **Block 12**: +legal pages + PWA polish

By **end of Block 4 (Week 6)**, you have a usable product that students can sign up for and learn on. The rest is depth and breadth.
