# PutraConsult Prototype 🎓💼

A centralized consultation booking platform for UPM students and lecturers to schedule and manage academic appointments efficiently.

## 🗂️ Project Structure
PutraConsult/
├── public/              # Static assets (logos, icons)
├── src/
│   ├── assets/          # Component images & styling assets
│   ├── firebase.js      # Global Firebase configuration & initializations
│   ├── App.jsx          # Main application router/layout
│   ├── main.jsx         # App entry point
│   └── index.css        # Global Tailwind/CSS styles
├── package.json         # Project dependencies (React, Vite, Firebase)
└── README.md            # Team documentation
---

## ⚙️ Prerequisites

Before running the project, make sure you have installed:
- [Node.js](https://nodejs.org/) (Version >= 18)
- Git installed on your local machine

---

## 🚀 Local Setup Guide

Follow these steps to get the development environment running on your machine:

### 1. Clone the Repository
Open your terminal, navigate to your workspace folder, and run:
```bash
git clone [https://github.com/zikryzaherman/PutraConsult.git](https://github.com/zikryzaherman/PutraConsult.git)
cd PutraConsult
2. Install Dependencies
Install all required project packages (including React, Vite, and Firebase SDK) by running:

Bash
npm install
3. Run the Development Server
Start your local testing server using:

Bash
npm run dev
Once active, open your browser and go to: http://localhost:5173

🌿 Git Branch & Workflow Strategy
To match standard software engineering practices, the main branch is protected and cannot be pushed to directly.

Branch Naming Convention
When working on a assigned task, always branch out from the latest main using this format:

feature/feature-name (e.g., feature/login-page, feature/booking-form)

fix/bug-name (e.g., fix/navbar-spacing)

Step-by-Step Developer Workflow
Sync your local repository with cloud main:

Bash
git checkout main
git pull origin main
Create your feature branch:

Bash
git checkout -b feature/your-task-name
Code your feature and save changes:

Bash
git add .
git commit -m "feat: short description of what you built"
Push your branch to GitHub:

Bash
git push origin feature/your-task-name
Open a Pull Request (PR): Go to the GitHub repository web page, open a new PR from your branch to main, and notify the PM for code review and merging.

🔐 Firebase Configurations
The core cloud database connection is handled globally inside src/firebase.js.

Database (Firestore): Currently running in Test Mode for prototype development.

Authentication: Email/Password provider is enabled for student/lecturer credentials.