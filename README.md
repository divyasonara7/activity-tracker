# 📌 Daily Growth Goal Tracker

A **personal growth tracking application** that helps users track daily learnings, maintain streaks, and stay motivated through visual feedback and habit-forming UX.

![Daily Growth Tracker](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![PWA](https://img.shields.io/badge/PWA-Ready-green)

---

## ✨ Features

### Current (MVP)
- **📝 Daily Entries** - Capture learnings, reflections, motivations, and exercise logs
- **🗒️ Sticky Notes** - Color-coded entries based on category with mood indicators
- **🔥 Streak Tracking** - Maintain daily streaks with configurable grace days
- **📱 Responsive Design** - Mobile-first with bottom nav, desktop side nav
- **💾 Offline-First** - IndexedDB persistence, works without internet
- **⚡ PWA Ready** - Installable as a native-like app

### Coming Soon
- 📅 Calendar View with entry visualization
- 📊 Dashboard with analytics & charts
- 🎯 Goals & Achievements system
- 🔔 Smart notifications & reminders

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Dev server:** http://localhost:5173

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **State** | Zustand 5 |
| **Database** | Dexie.js (IndexedDB) |
| **Routing** | React Router 7 |
| **Charts** | Recharts 2 |
| **Dates** | date-fns 3 |
| **PWA** | vite-plugin-pwa |

---

## 📁 Project Structure

```
src/
├── app/                 # App, Layout, Router
├── components/          # Shared UI components
│   ├── ui/              # Primitives (Button, Card, Input, Modal)
│   └── sticky-notes/    # Sticky note components
├── features/            # Feature modules
│   ├── today/           # Today View (active)
│   ├── calendar/        # Calendar View (coming soon)
│   ├── dashboard/       # Dashboard (coming soon)
│   └── goals/           # Goals (coming soon)
├── lib/                 # Core utilities
│   ├── db/              # IndexedDB layer
│   ├── streak-engine/   # Streak calculations
│   └── motivation-engine/ # Recall suggestions
├── stores/              # Zustand state stores
├── styles/              # Design tokens & globals
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

---

## 📖 Entry Categories

| Category | Emoji | Use Case |
|----------|-------|----------|
| Technology | 💻 | Coding, tech learnings |
| Finance | 💰 | Financial insights |
| Learning | 📚 | General knowledge |
| Exercise | 🏋️ | Workouts, health |
| Motivation | 💬 | Quotes, inspiration |
| Reflection | 🧠 | Personal thoughts |

---

## 🎨 Design Principles

- **No guilt design** - Missed days are faded, not highlighted
- **≤30 second entry** - Quick capture with minimal friction
- **Visual feedback** - Streaks, colors, and animations
- **Calm aesthetics** - Warm, encouraging color palette

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please read the requirements.md for the full product vision.
