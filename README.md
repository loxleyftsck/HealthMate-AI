# HealthMate AI 🩺

**HealthMate AI** is an intelligent health education assistant web application built with React and TypeScript. It provides users with AI-powered health consultations, daily health metric tracking, and personalized wellness guidance — all in a clean, modern interface.

> ⚠️ **Medical Disclaimer:** HealthMate AI is designed for **educational purposes only**. It does not replace professional medical advice, clinical diagnosis, or treatment by a licensed healthcare provider. Always consult a qualified doctor for medical concerns.

---

## ✨ Features

### 🤖 AI Health Consultation
- Real-time chat with an AI health assistant powered by **Google Gemini API**
- Automatic fallback to **offline mode** when no API key is provided
- Conversation history with context-aware responses (last 6 messages)
- Supports multiple Gemini models (2.5 Flash, 2.5 Pro, 2.0 Flash, etc.)

### 📊 Health Dashboard
| Tracker | Description |
|---------|-------------|
| **BMI Calculator** | Instant body mass index calculation with health category |
| **Water Intake** | Daily hydration logging with customizable goals |
| **Calorie Tracker** | Log meals by type (breakfast, lunch, dinner, snack) |
| **Exercise Log** | Track workouts, duration, and step count |
| **Sleep Journal** | Record sleep duration and quality rating |
| **Heart Health** | Monitor heart rate and blood pressure history |
| **Medication Reminder** | Daily medication checklist tracker |
| **Last Consultation** | Quick access to the most recent AI chat session |

### ⚙️ Customization
- Light / Dark / System theme support
- Bilingual interface: **Bahasa Indonesia** & English
- Configurable AI temperature and system instructions
- Plugin manager to enable/disable health modules

### 🧩 Plugin System
Six built-in health modules: `BMI`, `Nutrition`, `Symptom Checker`, `Water`, `Workout`, `Sleep`

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| AI Backend | Google Gemini API |
| Storage | Browser LocalStorage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/loxleyftsck/HealthMate-AI.git
cd HealthMate-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 AI Configuration (Optional)

To enable real AI responses, add your **Google Gemini API key** in the app's Settings page:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open the app → **Settings** → **Konfigurasi API Gemini**
3. Enter your API key and select your preferred model
4. Click **Simpan Konfigurasi**

> Without an API key, the app runs in **offline mode** with pre-built local responses.

---

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components (Button, Card, ChatBubble, etc.)
├── context/        # React contexts (Auth, Theme, HealthCompanion mascot)
├── hooks/          # Custom hooks (useLocalStorage, useTheme)
├── layout/         # App shell (MainLayout, Sidebar, TopNav, Footer)
├── pages/          # Route pages (Home, Chat, Dashboard, Settings)
├── plugins/        # Health module plugins (BMI, Nutrition, Sleep, etc.)
├── services/       # AI service layer (Gemini API + mock fallback)
├── types/          # TypeScript type definitions
└── utils/          # Utilities (markdown renderer)
```

---

## 🔒 Privacy & Data

- **All data is stored locally** in your browser's LocalStorage
- No data is sent to any external server (except prompts sent to the Gemini API when configured)
- Your API key is stored only in your browser and never transmitted to any third-party

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for better health education
</p>
