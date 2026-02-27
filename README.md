# Mutabaah Tracker PWA

A modern, mobile-first Progressive Web App (PWA) to track daily spiritual activities (Mutabaah). Built with Next.js, it prioritizes a local-first experience with offline support and seamless sync capabilities.

## ✨ Features

- **Email OTP Authentication**: Secure and passwordless login using Supabase Auth.
- **Detailed Tracking**: Grouped activities including:
  - Qiyamulail (Tahajud, Taubat, Hajat, Witir)
  - Sholat Jamaah (5 Times)
  - Sholat Sunnah Rawatib
  - Zikir Harian (Daily Dhikr)
  - Interaksi Al Quran (Quran Interaction)
  - Ibadah Lainnya (Other Acts of Worship)
- **Local-First Architecture**: Data is stored locally using IndexedDB for instant feedback and offline usage.
- **Streak Counter**: Stay motivated with daily streak tracking.
- **Installable PWA**: Install directly on your mobile device for a native-like experience.
- **Clean UI**: Modern, minimalist design with a soft green and white palette.

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database (Local)**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **PWA Support**: [Serwist](https://serwist.pages.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase Project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fauzihiz/mutabaah-pwa.git
   cd mutabaah-pwa/mutabaah-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `mutabaah-pwa` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📱 PWA Features

This app is designed to be mobile-first. After running the app in your mobile browser, use the "Add to Home Screen" option to install it as a PWA.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.