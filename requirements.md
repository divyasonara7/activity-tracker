# 📌 Daily Growth Goal Tracker

**Product Requirements Document (PRD)**

---

## 1. 📖 Overview

The **Daily Growth Goal Tracker** is a personal growth product that helps users:

* Track **daily learning & self-improvement**
* Capture insights as **sticky notes**
* Maintain **streaks & consistency**
* Get **motivated on low-energy days**
* Visualize **weekly & long-term progress**

The product blends **learning, reflection, and motivation** into a single habit-forming experience using a **calendar + sticky note metaphor**.

---

## 2. 🎯 Problem Statement

People:

* Learn new things daily but **don’t revisit them**
* Lose motivation during low-energy days
* Start goals enthusiastically but **fail to maintain streaks**
* Have no visual feedback for growth consistency

Existing tools are either:

* Too complex (Notion, Obsidian)
* Too shallow (basic habit trackers)
* Not emotionally motivating

---

## 3. 💡 Solution

A **minimal yet emotionally engaging tracker** that:

* Stores daily learnings as **sticky notes**
* Shows **growth visually on a calendar**
* Reminds users of **past learnings randomly**
* Reinforces habits via **streaks & analytics**

---

## 4. 👤 Target Users

### Primary

* Software engineers / professionals
* Lifelong learners
* People preparing for interviews or career growth

### Secondary

* Students
* Creators & writers
* Personal development enthusiasts

---

## 5. 🧩 Core Features

---

### 5.1 Daily Growth Entry

Users can add **one or more daily entries** under:

* 📘 Learning (Technology, Finance, Other)
* 🏋️ Exercise / Health
* 💬 Motivation / Quotes
* 🧠 Personal Insight / Reflection

Each entry:

* Title (optional)
* Content (rich text / markdown)
* Category (tag-based)
* Mood (🔥 / 🙂 / 😐 / 😞)
* Time spent (optional)

---

### 5.2 Sticky Notes System

* Each entry becomes a **virtual sticky note**
* Color-coded by category
* Can be:

  * Pinned
  * Archived
  * Edited
* Sticky notes can be revisited from:

  * Calendar
  * Dashboard
  * Random reminder system

---

### 5.3 Calendar View (Core UX)

![Image](https://s3-alpha.figma.com/hub/file/2282904466175423897/59a8a864-7910-4bc9-9fbe-4f934bf41d35-cover.png)

![Image](https://www.slideegg.com/image/catalog/14163-sticky-note-calendar-slide-template.png)

![Image](https://cdn.dribbble.com/userupload/44183899/file/original-5c870c8aa945a1a6220ed1b4985d3a7b.png?resize=400x0)

* Month & week view
* Each day shows:

  * Number of entries
  * Streak indicator
  * Mood color
* Clicking a day opens its sticky notes
* Missed days are visually faded (no shame UX)

---

### 5.4 Streak System

* Daily streak for:

  * Learning
  * Exercise
  * Reflection
* Streak rules:

  * At least **1 meaningful entry/day**
  * Grace days (configurable)
* Visual cues:

  * Fire icon 🔥
  * Progress rings
* Longest streak saved permanently

---

### 5.5 Motivation Recall Engine

On low-activity days, system:

* Randomly resurfaces:

  * Past motivation quotes
  * Breakthrough learnings
  * High-mood days
* Notifications:

  * “You wrote this on a tough day — remember this?”
  * “You were consistent for 14 days once. You can do it again.”

---

### 5.6 Dashboard & Analytics

![Image](https://cdn.dribbble.com/userupload/11803196/file/original-a1d3b23aa58d02cf9a8c22559b7be4a6.png?crop=0x0-6402x4801\&format=webp\&resize=400x300\&vertical=center)

![Image](https://uploads-ssl.webflow.com/640876afbfd1544a85a42a04/640b1dc290971b1fb2e6877a_finan.jpg)

![Image](https://cdn.dribbble.com/userupload/27408030/file/original-e54be0c1cd192f77d487b4fc0265d4a3.png?format=webp\&resize=400x300\&vertical=center)

**Dashboard Metrics:**

* Total active days
* Current streak
* Longest streak
* Category distribution
* Weekly comparison (↑ / ↓)

**Charts:**

* Weekly growth vs last week
* Category balance
* Mood trends
* Consistency heatmap

---

### 5.7 Goals & Achievements

* Users can define:

  * Short-term goals (7–14 days)
  * Long-term goals (30–90 days)
* Auto achievements:

  * “7-Day Learning Streak”
  * “Consistency Champion”
  * “Reflection Master”
* Soft celebration UX (not gamified aggressively)

---

## 6. 🧠 UX Principles

* **No guilt design**
* **Encouraging, not pushy**
* Visual > text
* Calm color palette
* Minimal friction for daily entry (≤ 30 seconds)

---

## 7. 📱 Key Screens

1. Onboarding (Goal selection)
2. Today View (Quick add)
3. Calendar View
4. Sticky Notes Board
5. Dashboard & Analytics
6. Goals & Achievements
7. Settings

---

## 8. 🔔 Notifications & Reminders

* Daily reminder (custom time)
* Random past learning reminder
* Streak risk alert (gentle)
* Weekly reflection summary

---

## 9. 🗄️ Data Model (High-Level)

```ts
User
- id
- preferences
- streaks
- goals

Entry
- id
- userId
- date
- category
- content
- mood
- tags

Streak
- type
- currentCount
- longestCount

Analytics
- weeklySummary
- categoryBreakdown
- moodTrends
```

---

## 10. ⚙️ Tech Considerations (Optional)

* Frontend: React / Vue (Composition API friendly)
* Calendar rendering: virtualized
* Local-first + cloud sync
* Offline support
* PWA ready

---

## 11. 🚀 Future Enhancements

* AI reflection summaries
* Voice notes
* Smart insights (“You learn best on Tuesdays”)
* Public/private shareable highlights
* Theme customization

---

## 12. 📏 Success Metrics

* 7-day retention rate
* Average streak length
* Weekly active usage
* Entries per active day
* Goal completion %

---

## 13. 🔥 Why This Product Wins

* Emotional + logical motivation
* Visual habit reinforcement
* Long-term memory recall
* Not just tracking — **reflection & growth**

---
