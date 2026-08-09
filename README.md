# 🌙 Mutabaah Tracker

A PWA to help Muslims track daily worship habits — offline, private, and motivating.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green)](../LICENSE)

---

## What It Does

Mutabaah Tracker is a Progressive Web App that helps you build consistent worship habits. Inspired by the concept of *mutabaah* (self-monitoring) in Islam, it lets you:

- Check off daily worship activities with one tap
- See your monthly progress in an interactive grid
- Earn badges for consistency and streaks
- Use the app fully offline — no login, no account needed

---

## Features

- **Monthly Grid** — tap to mark completed activities; past days are editable, future days are locked automatically
- **Badge System** — unlock achievements based on real streaks, not just login
- **Dark Mode** — toggle from the header, preference saved locally
- **Monthly Planner** — write daily notes and plans for each day of the month
- **Statistics** — view category-level and overall completion stats with charts
- **Installable PWA** — add to your home screen, works like a native app

### Badges

| Badge | Requirement |
|---|---|
| **Lail al-Awwal** | 3 consecutive nights of Tahajud |
| **Muqarrabun** | 7 consecutive nights of Tahajud |
| **Sahib al-Fajr** | 7 consecutive days of Subuh on time |
| **Ahlul Quran** | 30 consecutive days of Tilawah |
| **Al-Karim** | 7 consecutive days of Sedekah |
| **Al-Mujtahid** | 30-day streak of any activity |

Badges are defined in code (`lib/achievements.ts`). To add or edit badges, modify the `ACHIEVEMENTS` array and redeploy.

---

## Tech Stack

| Layer | Tech |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **Local DB** | [Dexie.js](https://dexie.org/) (IndexedDB) |
| **PWA** | [Serwist](https://serwist.pages.dev/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Getting Started

**Prerequisite:** Node.js 18+

### Install

```bash
git clone https://github.com/fauzihiz/mutabaah-pwa.git
cd mutabaah-pwa/mutabaah-pwa
npm install
```

### Run

```bash
npm run dev
# Open http://localhost:3000
```

No environment variables needed. Everything runs locally in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## Project Structure

```
mutabaah-pwa/
├── app/
│   ├── page.tsx            # Dashboard (main screen)
│   └── layout.tsx          # Root layout + theme provider
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx     # Header + dark mode toggle
│   │   ├── AchievementCarousel.tsx # Badge carousel
│   │   ├── MutabaahGrid.tsx       # Monthly activity grid
│   │   ├── MonthPicker.tsx        # Month navigation
│   │   ├── StatsView.tsx          # Statistics charts
│   │   ├── MonthlyPlannerView.tsx # Daily notes planner
│   │   ├── NavigationDrawer.tsx   # Side menu
│   │   ├── ChangelogModal.tsx     # Version history
│   │   └── DashboardFooter.tsx    # Footer
│   └── providers/
│       └── ThemeProvider.tsx       # Dark/light mode context
├── hooks/
│   ├── useMutabaah.ts             # Activity logs (IndexedDB)
│   ├── useMonthlyAchievements.ts  # Badge computation per month
│   ├── useMonthlyStats.ts         # Statistics computation
│   ├── useMonthlyPlanner.ts       # Planner notes (IndexedDB)
│   └── useActivitySettings.ts     # Custom activity names (IndexedDB)
├── lib/
│   ├── db.ts                      # Dexie schema (IndexedDB)
│   ├── achievements.ts            # Badge definitions + logic
│   └── constants/
│       └── activities.ts          # Activity list & categories
└── public/
    ├── manifest.json
    └── favicon.png
```

---

## Roadmap

### 📊 Phase 1 — Statistics & Analytics
- [ ] Weekly summary card on the main page
- [ ] Activity heatmap (calendar-style, like GitHub contributions)
- [ ] Real-time daily completion percentage indicator

### 🔔 Phase 2 — Personalization & Notifications
- [ ] Push notification reminders (e.g., Subuh at 04:00)
- [ ] Custom activities — add or hide specific activities
- [ ] Personal daily targets

### 🤝 Phase 3 — Community & Social
- [ ] Streak leaderboard with friends/groups
- [ ] Mutabaah groups — monitor each other's progress
- [ ] Share badges to social media

### ☁️ Phase 4 — Backup & Multi-Device
- [ ] Export/import data as CSV or JSON
- [ ] Cloud sync for cross-device access

### 🧠 Phase 5 — Smart Features
- [ ] Smart insights — analyze worship patterns and suggest improvements
- [ ] Next badge recommendation ("2 more days to *Muqarrabun*!")
- [ ] Automatic monthly report

---

## Notes

- **All data is stored locally** in your browser (IndexedDB). Clearing browser data or uninstalling the app will delete your records.
- **No account or login** is required. Anyone can open and use the app directly.
- **No cloud sync** exists yet. Data stays on the device and browser where it was created.
- To add new badges, edit the `ACHIEVEMENTS` array in `lib/achievements.ts` and redeploy.

---

## Contributing

Pull requests are welcome! For large changes, open an issue first to discuss what you'd like to change.

---

## Author

**Fauzi Hizbullah**  
[fauzihiz.github.io](https://fauzihiz.github.io) · [GitHub @fauzihiz](https://github.com/fauzihiz)

---

## License

This project is licensed under **MIT** — see [LICENSE](../LICENSE) for details.

---

<div align="center">
  <sub>Semoga menjadi amal jariyah. بارك الله فيكم</sub>
</div>