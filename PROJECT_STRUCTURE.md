# 🏠 Home Tution - Project Structure

A full-stack **Home Tuition Booking Platform** built with **React (Vite)** for the frontend and **Node.js (Express)** for the backend.

---

## 📁 Overall Folder Structure

```
Home-Tution/
├── client/                  # 🖥️ Frontend (React + Vite)
├── server/                  # ⚙️ Backend (Node.js + Express)
├── package-lock.json        # Root lock file
└── PROJECT_STRUCTURE.md     # This file
```

---

## ⚙️ Server (Backend) — `server/`

The backend follows the **MVC (Model-View-Controller)** architecture pattern, which separates concerns into distinct layers for clean, maintainable code.

```
server/
├── server.js                # 🚀 Entry point - starts the Express server
├── package.json             # Backend dependencies & scripts
│
├── config/                  # 🔧 Configuration
│   └── db.js                # Database connection setup (MongoDB)
│
├── models/                  # 📦 Data Models (Mongoose Schemas)
│   ├── User.js              # User schema (students & tutors)
│   ├── Tutor.js             # Tutor profile schema (subjects, experience, etc.)
│   ├── Booking.js           # Booking/session schema (student ↔ tutor)
│   └── Review.js            # Review/rating schema for tutors
│
├── controllers/             # 🎮 Business Logic (handles requests)
│   ├── authController.js    # Login, Register, Logout logic
│   ├── tutorController.js   # CRUD operations for tutor profiles
│   ├── bookingController.js # Create, update, cancel bookings
│   └── adminController.js   # Admin-specific operations (manage users/tutors)
│
├── routes/                  # 🛣️ API Routes (URL → Controller mapping)
│   ├── authRoutes.js        # /api/auth/* → authController
│   ├── tutorRoutes.js       # /api/tutors/* → tutorController
│   ├── bookingRoutes.js     # /api/bookings/* → bookingController
│   └── adminRoutes.js       # /api/admin/* → adminController
│
├── middleware/              # 🛡️ Middleware (runs before controllers)
│   ├── authMiddleware.js    # JWT token verification & role checking
│   └── errorMiddleware.js   # Global error handler
│
└── utils/                   # 🔨 Utility/Helper functions
    └── generateToken.js     # JWT token generation helper
```

### How the Server Layers Work Together

```
Client Request
     │
     ▼
┌─────────────┐
│   Routes     │  ← Defines URL paths (e.g., POST /api/auth/login)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware   │  ← Checks auth token, handles errors
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers  │  ← Contains the business logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models     │  ← Interacts with the database (MongoDB)
└──────┬──────┘
       │
       ▼
   Database
   (MongoDB)
```

### Detailed Explanation of Each Folder

#### 📁 `config/db.js` — Database Connection
- Connects to **MongoDB** using Mongoose
- Reads the database URL from environment variables (`.env` file)
- Called once when the server starts

#### 📁 `models/` — Database Schemas
Defines the shape of data stored in MongoDB:

| File          | Purpose                                          |
|---------------|--------------------------------------------------|
| `User.js`     | Stores user info (name, email, password, role)   |
| `Tutor.js`    | Tutor profile (subjects, qualifications, fees)   |
| `Booking.js`  | Session bookings between students and tutors     |
| `Review.js`   | Student reviews and ratings for tutors           |

#### 📁 `controllers/` — Business Logic
Handles what happens when an API endpoint is hit:

| File                   | Handles                                         |
|------------------------|--------------------------------------------------|
| `authController.js`    | User registration, login, password management    |
| `tutorController.js`   | Create/edit/delete/search tutor profiles         |
| `bookingController.js` | Book sessions, view bookings, cancel bookings    |
| `adminController.js`   | Admin dashboard, user management, approvals      |

#### 📁 `routes/` — API Endpoints
Maps URLs to controller functions:

| File               | Base Path         | Example Endpoints                    |
|--------------------|-------------------|--------------------------------------|
| `authRoutes.js`    | `/api/auth`       | `POST /login`, `POST /register`     |
| `tutorRoutes.js`   | `/api/tutors`     | `GET /`, `GET /:id`, `PUT /:id`     |
| `bookingRoutes.js` | `/api/bookings`   | `POST /`, `GET /my-bookings`        |
| `adminRoutes.js`   | `/api/admin`      | `GET /users`, `DELETE /users/:id`   |

#### 📁 `middleware/` — Request Interceptors
Runs before controller logic:

| File                  | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `authMiddleware.js`   | Verifies JWT token, checks if user is logged in   |
| `errorMiddleware.js`  | Catches errors and sends proper error responses    |

#### 📁 `utils/generateToken.js` — Helper
- Generates a **JWT (JSON Web Token)** for authentication
- Called after successful login/register

---

## 🖥️ Client (Frontend) — `client/`

The frontend is a **React** app using **Vite** as the build tool.

```
client/
├── package.json             # Frontend dependencies & scripts
├── public/                  # 🌐 Static files
│   └── index.html           # HTML template
│
└── src/                     # 📂 Source code
    ├── main.jsx             # ⚡ Entry point - renders React app
    ├── App.jsx              # 🏗️ Root component with routing setup
    │
    ├── components/          # 🧩 Reusable UI Components
    │   ├── Navbar.jsx       # Navigation bar
    │   ├── Footer.jsx       # Page footer
    │   ├── TutorCard.jsx    # Tutor display card
    │   └── Loader.jsx       # Loading spinner
    │
    ├── pages/               # 📄 Page Components (one per route)
    │   ├── Home.jsx         # Landing/home page
    │   ├── Login.jsx        # Login page
    │   ├── Register.jsx     # Registration page
    │   ├── TutorList.jsx    # Browse all tutors
    │   ├── TutorProfile.jsx # Individual tutor details
    │   ├── StudentDashboard.jsx  # Student's dashboard
    │   ├── TutorDashboard.jsx    # Tutor's dashboard
    │   └── AdminDashboard.jsx    # Admin panel
    │
    ├── context/             # 🔄 React Context (Global State)
    │   └── AuthContext.jsx  # Authentication state (logged in user, token)
    │
    ├── routes/              # 🛣️ Route Protection
    │   └── PrivateRoute.jsx # Blocks unauthenticated users from pages
    │
    ├── services/            # 📡 API Communication
    │   └── api.js           # Axios/fetch setup to call backend APIs
    │
    └── utils/               # 🔨 Helper Functions
        └── constants.js     # App-wide constants (API URL, roles, etc.)
```

---

## 🔑 Tech Stack Summary

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React, Vite, JSX               |
| Backend    | Node.js, Express.js            |
| Database   | MongoDB + Mongoose             |
| Auth       | JWT (JSON Web Tokens)          |
| API Style  | REST API                       |

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas cloud)

### 1. Server Setup
```bash
cd server
npm install
# Create a .env file with: MONGO_URI, JWT_SECRET, PORT
npm start
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

---

## ⚠️ Current Status

> **Note:** All files currently have the folder structure created but the code inside each file is **empty (0 bytes)**. Each team member needs to write the actual code for their assigned files.

---

## 👥 Team Workflow (Git Branching)

```
main (protected)
  ├── charansai (your branch)
  ├── teammate-2
  └── teammate-3
```

1. Each member works on their own branch
2. Write code → `git add .` → `git commit -m "message"`
3. Push to your branch → `git push origin charansai`
4. Create a **Pull Request** on GitHub to merge into `main`
