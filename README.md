# PutraConsult 🎓💼

> A centralized consultation booking platform for UPM students and lecturers to schedule and manage academic appointments efficiently.

---

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend | Firebase (Authentication + Firestore + Analytics) |

There is no separate Node/Express backend — the React app talks to Firebase directly from the client.

---

## 📁 Project Structure

```
PutraConsult/
├── public/                        # Static assets (favicon, icon sprite)
├── src/
│   ├── assets/                    # Images (hero.png, upm-logo.png, etc.)
│   ├── firebase/
│   │   └── config.js              # Firebase app initialization (Auth, Firestore, Analytics)
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state + all Firestore reads/writes (users, slots, bookings)
│   ├── components/
│   │   └── ui/Badge.jsx           # Status badge used on booking/request cards
│   ├── layouts/
│   │   └── DashboardLayout.jsx    # Shared shell: top bar, sidebar nav, notification drawer
│   ├── pages/
│   │   ├── auth/                  # Login.jsx, Register.jsx
│   │   ├── student/                # FindLecturer.jsx, BookAppointment.jsx, ViewBookingStatus.jsx
│   │   ├── lecturer/                # ManageAvailability.jsx, ManageRequests.jsx
│   │   └── Home.jsx
│   ├── App.jsx                    # Router setup + role-based route guarding
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Tailwind v4 entry + custom CSS variables
├── package.json                   # Project dependencies (React, Vite, Firebase, Tailwind)
└── README.md                      # Team documentation
```

> 📝 **Note:** `src/firebase/authService.js`, `src/firebase/bookingService.js`, `src/components/Navbar.jsx`, `src/components/Sidebar.jsx`, and `src/pages/shared/Notifications.jsx` exist in the repo but aren't currently imported anywhere — `AuthContext.jsx` and `DashboardLayout.jsx` ended up handling that logic directly instead. Safe to ignore for now; worth a cleanup pass before final submission so the docs and code don't disagree.

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

No `.env` file or extra config is needed to get running — the shared Firebase project credentials are already committed in `src/firebase/config.js` (see below).

---

## 🔐 Firebase Configuration

Firebase is initialized in `src/firebase/config.js`, pointing to the shared project **`putraconsult-baddie888`**.

| Service | Status |
|---------|--------|
| Firestore (Database) | ✅ Test Mode (prototype) |
| Authentication | ✅ Email/Password enabled |

> ⚠️ **Firestore Test Mode rules expire 30 days after the database is created.** If the app suddenly can't read/write anything (permission-denied errors in the console), this is the most likely cause — ask whoever owns the Firebase project to extend/replace the rules in **Firebase Console → Firestore → Rules**. Update to proper security rules before any real/production deployment.

> 💡 `.env` and `.env.local` are already in `.gitignore`, but the app doesn't currently read any environment variables — the config above is hardcoded and committed. That's fine for a shared class prototype on a non-billing Firebase project, but if this ever needs separating per-developer or going to production, move `firebaseConfig` into `import.meta.env.VITE_*` variables and a local `.env` file.

---

## 🗄️ Firestore Data Model

No `firestore.rules` or `firestore.indexes.json` are checked into the repo — collections are created implicitly the first time data is written, and no manual indexes are needed since every query here only uses equality filters. For reference, here's the shape of each collection used by the app:

**`users`** (doc ID = Firebase Auth UID)
```js
{ uid, name, email, role: "student" | "lecturer", idCode, department, createdAt }
```

**`slots`** — a lecturer's open consultation slots
```js
{ lecturerId, date: "YYYY-MM-DD", time: "HH:MM", isBooked }
```

**`bookings`** — a student's request against a slot
```js
{ studentId, studentName, studentIdCode, lecturerId, lecturerName, slotId, date, time, description, status: "pending" | "approved" | "declined", createdAt, statusUpdatedAt }
```

---

## 🧪 Testing the App Locally

The UI and routes differ by role, so to see the full flow you'll want **two accounts**:

1. Go to `/register`, sign up once with **Role = Lecturer** → lands on **Manage Requests / Manage Availability**.
2. Add a few availability slots as that lecturer.
3. Sign up a second time (different email) with **Role = Student** → lands on **Find & Book Lecturer**.
4. Book a slot with the lecturer you created, then switch back to the lecturer account to approve/decline it and watch the notification bell update on both sides.

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

## 👥 Team

Built by the PutraConsult team as part of the Component-Based Software Engineering project at **Universiti Putra Malaysia (UPM)**.
