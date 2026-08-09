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
- Personalize your greeting name
- Use the app fully offline — no login, no account needed

---

## Features

- **Monthly Grid** — tap to mark completed activities; past days are editable, future days are locked automatically
- **Dark Mode** — toggle from the header, preference saved locally
- **Customizable Greeting** — tap the name next to "Assalamualaikum" to personalize it
- **Statistics** — view category-level and overall completion stats with charts
- **Installable PWA** — add to your home screen, works like a native app

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
│   │   ├── DashboardHeader.tsx     # Header + logo + dark mode toggle
│   │   ├── MutabaahGrid.tsx       # Monthly activity grid
│   │   ├── MonthPicker.tsx        # Month navigation
│   │   ├── StatsView.tsx          # Statistics charts
│   │   ├── NavigationDrawer.tsx   # Side menu
│   │   ├── ChangelogModal.tsx     # Version history
│   │   └── DashboardFooter.tsx    # Footer
│   └── providers/
│       └── ThemeProvider.tsx       # Dark/light mode context
├── hooks/
│   ├── useMutabaah.ts             # Activity logs (IndexedDB)
│   ├── useMonthlyStats.ts         # Statistics computation
│   └── useActivitySettings.ts     # Custom activity names (IndexedDB)
├── lib/
│   ├── db.ts                      # Dexie schema (IndexedDB)
│   └── constants/
│       └── activities.ts          # Activity list & categories
└── public/
    ├── manifest.json
    ├── favicon.ico
    └── logo.png
```

---

## Notes

- **All data is stored locally** in your browser (IndexedDB). Clearing browser data or uninstalling the app will delete your records.
- **No account or login** is required. Anyone can open and use the app directly.
- **No cloud sync** exists yet. Data stays on the device and browser where it was created.

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