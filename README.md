# PutraConsult 🎓💼

> A centralized consultation booking platform for UPM students and lecturers to schedule and manage academic appointments efficiently.

---

## 📁 Project Structure

```
PutraConsult/
├── public/               # Static assets (logos, icons)
├── src/
│   ├── assets/           # Component images & styling assets
│   ├── firebase.js       # Global Firebase configuration & initialization
│   ├── App.jsx           # Main application router & layout
│   ├── main.jsx          # App entry point
│   └── index.css         # Global Tailwind/CSS styles
├── package.json          # Project dependencies (React, Vite, Firebase)
└── README.md             # Team documentation
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)

---

## 🚀 Local Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/zikryzaherman/PutraConsult.git
cd PutraConsult
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Then open your browser at: **http://localhost:5173**

---

## 🌿 Git Branch & Workflow Strategy

The `main` branch is protected — never push directly to it. Always branch out and submit a Pull Request.

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| New feature | `feature/feature-name` | `feature/login-page` |
| Bug fix | `fix/bug-name` | `fix/navbar-spacing` |

### Step-by-Step Developer Workflow

**1. Sync with the latest `main`**
```bash
git checkout main
git pull origin main
```

**2. Create your feature branch**
```bash
git checkout -b feature/your-task-name
```

**3. Commit your changes**
```bash
git add .
git commit -m "feat: short description of what you built"
```

**4. Push to GitHub**
```bash
git push origin feature/your-task-name
```

**5. Open a Pull Request**

Go to the repository on GitHub, open a new PR from your branch to `main`, and notify the **PM** for code review and merging.

---

## 🔐 Firebase Configuration

Firebase is configured globally in `src/firebase.js`.

| Service | Status |
|---------|--------|
| Firestore (Database) | ✅ Test Mode (prototype) |
| Authentication | ✅ Email/Password enabled |

> ⚠️ Firestore is currently running in **Test Mode** for prototype development. Update security rules before production deployment.

---

## 👥 Team

Built by the PutraConsult team as part of the Component-Based Software Engineering project at **Universiti Putra Malaysia (UPM)**.