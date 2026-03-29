# 🚀 Home Tution — Step-by-Step Implementation Plan

A complete guide to build the project from scratch. Follow the steps **in order** — each step depends on the previous one.

---

## 📋 Pre-requisites (Do These First)

- [ ] Install **Node.js** (v18+) → [https://nodejs.org](https://nodejs.org)
- [ ] Install **MongoDB** locally OR create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- [ ] Install **VS Code** extensions: ES7 React Snippets, Prettier, ESLint
- [ ] Make sure **Git** is installed and configured

---

## PHASE 1: Server Setup (Backend)

### Step 1 — Initialize the Server Project
```bash
cd server
npm init -y
```
This creates `package.json` with default values.

### Step 2 — Install Server Dependencies
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install nodemon --save-dev
```

| Package       | Purpose                                    |
|---------------|--------------------------------------------|
| `express`     | Web framework for building REST APIs       |
| `mongoose`    | MongoDB object modeling (schemas, queries)  |
| `dotenv`      | Load environment variables from `.env` file |
| `bcryptjs`    | Hash passwords before storing              |
| `jsonwebtoken`| Create & verify JWT tokens for auth        |
| `cors`        | Allow frontend to call backend APIs        |
| `nodemon`     | Auto-restart server on file changes (dev)   |

### Step 3 — Create `.env` File
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/home-tution
JWT_SECRET=your_secret_key_here_change_this
```
> ⚠️ **Never push `.env` to GitHub!** Add it to `.gitignore`.

### Step 4 — Update `package.json` Scripts
In `server/package.json`, update the scripts section:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## PHASE 2: Server Core Files (Build in This Order)

### Step 5 — `config/db.js` (Database Connection)
**What to write:**
- Import `mongoose`
- Create an async function `connectDB`
- Use `mongoose.connect(process.env.MONGO_URI)` to connect
- Add `try/catch` for error handling
- Export the function

**Example structure:**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Step 6 — `utils/generateToken.js` (JWT Helper)
**What to write:**
- Import `jsonwebtoken`
- Create a function that takes a user ID
- Return a signed JWT token with expiration (e.g., 30 days)

**Example structure:**
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
```

### Step 7 — `models/User.js` (User Schema)
**Fields to include:**
```
- name:      String, required
- email:     String, required, unique
- password:  String, required
- role:      String, enum: ['student', 'tutor', 'admin'], default: 'student'
- phone:     String
- createdAt: Date, default: Date.now
```
**Also add:**
- Pre-save middleware to hash password using `bcryptjs`
- A method `matchPassword(enteredPassword)` to compare passwords

### Step 8 — `models/Tutor.js` (Tutor Profile Schema)
**Fields to include:**
```
- user:           ObjectId (reference to User model), required
- subjects:       [String], required
- qualifications: String, required
- experience:     Number (years)
- hourlyRate:     Number, required
- location:       String
- bio:            String
- availability:   [String] (e.g., ['Monday', 'Wednesday'])
- rating:         Number, default: 0
- totalReviews:   Number, default: 0
- isVerified:     Boolean, default: false
- createdAt:      Date, default: Date.now
```

### Step 9 — `models/Booking.js` (Booking Schema)
**Fields to include:**
```
- student:    ObjectId (ref: User), required
- tutor:      ObjectId (ref: Tutor), required
- subject:    String, required
- date:       Date, required
- time:       String, required
- duration:   Number (hours), required
- status:     String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending'
- totalPrice: Number
- notes:      String
- createdAt:  Date, default: Date.now
```

### Step 10 — `models/Review.js` (Review Schema)
**Fields to include:**
```
- student:   ObjectId (ref: User), required
- tutor:     ObjectId (ref: Tutor), required
- rating:    Number (1-5), required
- comment:   String
- createdAt: Date, default: Date.now
```

---

## PHASE 3: Middleware

### Step 11 — `middleware/authMiddleware.js`
**What to write:**
- `protect` middleware: Extract JWT from `Authorization` header → verify token → attach user to `req.user`
- `admin` middleware: Check if `req.user.role === 'admin'`
- `tutor` middleware: Check if `req.user.role === 'tutor'`

### Step 12 — `middleware/errorMiddleware.js`
**What to write:**
- `notFound` middleware: Catches 404 errors for undefined routes
- `errorHandler` middleware: Global error handler with proper status codes and messages

---

## PHASE 4: Controllers (Business Logic)

### Step 13 — `controllers/authController.js`
**Functions to write:**

| Function         | Route              | Description                     |
|------------------|--------------------|---------------------------------|
| `registerUser`   | POST /api/auth/register | Create new user, return token  |
| `loginUser`      | POST /api/auth/login    | Verify credentials, return token |
| `getUserProfile` | GET /api/auth/profile   | Get logged-in user's profile   |
| `updateProfile`  | PUT /api/auth/profile   | Update user profile            |

### Step 14 — `controllers/tutorController.js`
**Functions to write:**

| Function          | Route                  | Description                     |
|-------------------|------------------------|---------------------------------|
| `createTutorProfile` | POST /api/tutors      | Create a tutor profile         |
| `getAllTutors`     | GET /api/tutors         | List all tutors (with filters) |
| `getTutorById`    | GET /api/tutors/:id     | Get single tutor details       |
| `updateTutor`     | PUT /api/tutors/:id     | Update tutor profile           |
| `deleteTutor`     | DELETE /api/tutors/:id  | Delete tutor profile           |

### Step 15 — `controllers/bookingController.js`
**Functions to write:**

| Function           | Route                    | Description                     |
|--------------------|--------------------------|----------------------------------|
| `createBooking`    | POST /api/bookings       | Student books a tutor           |
| `getMyBookings`    | GET /api/bookings/mine   | Get logged-in user's bookings   |
| `updateBookingStatus` | PUT /api/bookings/:id | Tutor confirms/cancels booking  |
| `deleteBooking`    | DELETE /api/bookings/:id | Cancel a booking                |

### Step 16 — `controllers/adminController.js`
**Functions to write:**

| Function          | Route                     | Description                     |
|-------------------|---------------------------|---------------------------------|
| `getAllUsers`      | GET /api/admin/users      | List all users                  |
| `deleteUser`      | DELETE /api/admin/users/:id | Delete a user                 |
| `verifyTutor`     | PUT /api/admin/tutors/:id/verify | Approve a tutor           |
| `getDashboardStats` | GET /api/admin/stats    | Get counts & statistics         |

---

## PHASE 5: Routes (URL Mapping)

### Step 17 — `routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
```

### Step 18 — `routes/tutorRoutes.js`
- `GET /` → getAllTutors (public)
- `GET /:id` → getTutorById (public)
- `POST /` → createTutorProfile (protected, tutor only)
- `PUT /:id` → updateTutor (protected, tutor only)
- `DELETE /:id` → deleteTutor (protected, tutor/admin)

### Step 19 — `routes/bookingRoutes.js`
- All routes should be **protected** (require login)
- Map each booking controller function to its route

### Step 20 — `routes/adminRoutes.js`
- All routes should be **protected + admin only**
- Map each admin controller function to its route

---

## PHASE 6: Server Entry Point

### Step 21 — `server.js` (Main File)
**What to write:**
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tutors', require('./routes/tutorRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 22 — Test the Server
```bash
cd server
npm run dev
```
✅ You should see: `Server running on port 5000` and `MongoDB Connected`

### Step 23 — Test APIs with Postman
Test these endpoints:
1. `POST http://localhost:5000/api/auth/register` — Register a user
2. `POST http://localhost:5000/api/auth/login` — Login
3. `GET http://localhost:5000/api/tutors` — List tutors

---

## PHASE 7: Client Setup (Frontend)

### Step 24 — Initialize React with Vite
```bash
cd client
npm create vite@latest ./ -- --template react
npm install
```

### Step 25 — Install Client Dependencies
```bash
npm install axios react-router-dom react-icons react-toastify
```

| Package            | Purpose                              |
|--------------------|--------------------------------------|
| `axios`            | Make HTTP requests to backend API    |
| `react-router-dom` | Page routing/navigation             |
| `react-icons`      | Icon library                        |
| `react-toastify`   | Toast notifications                 |

### Step 26 — Setup Proxy (Vite Config)
In `client/vite.config.js`, add proxy to avoid CORS in development:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

---

## PHASE 8: Client Core Files (Build in This Order)

### Step 27 — `src/utils/constants.js`
```javascript
export const API_URL = '/api';
export const ROLES = { STUDENT: 'student', TUTOR: 'tutor', ADMIN: 'admin' };
```

### Step 28 — `src/services/api.js`
- Create an Axios instance with `baseURL`
- Add request interceptor to attach JWT token from localStorage
- Export API helper functions (`login`, `register`, `getTutors`, etc.)

### Step 29 — `src/context/AuthContext.jsx`
- Create React Context for authentication
- Store: `user`, `token`, `isLoading`
- Provide: `login()`, `register()`, `logout()` functions
- Check localStorage on app load for existing token

### Step 30 — `src/routes/PrivateRoute.jsx`
- If user is logged in → show the page
- If not → redirect to `/login`

### Step 31 — `src/components/` (Reusable Components)
Build these in order:
1. **`Navbar.jsx`** — Logo, nav links, login/logout button
2. **`Footer.jsx`** — Simple footer with copyright
3. **`Loader.jsx`** — Loading spinner animation
4. **`TutorCard.jsx`** — Card showing tutor name, subjects, rating, price

### Step 32 — `src/pages/` (Page Components)
Build these in order:
1. **`Home.jsx`** — Landing page with hero section, features, CTA
2. **`Register.jsx`** — Registration form (name, email, password, role)
3. **`Login.jsx`** — Login form (email, password)
4. **`TutorList.jsx`** — Grid of TutorCards with search/filter
5. **`TutorProfile.jsx`** — Detailed tutor page with booking button
6. **`StudentDashboard.jsx`** — Student's bookings, upcoming sessions
7. **`TutorDashboard.jsx`** — Tutor's bookings, earnings
8. **`AdminDashboard.jsx`** — Admin panel: users, tutors, stats

### Step 33 — `src/App.jsx` (Root Component with Routes)
```jsx
<BrowserRouter>
  <AuthProvider>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tutors" element={<TutorList />} />
      <Route path="/tutors/:id" element={<TutorProfile />} />
      <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
      <Route path="/tutor/dashboard" element={<PrivateRoute><TutorDashboard /></PrivateRoute>} />
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
    </Routes>
    <Footer />
  </AuthProvider>
</BrowserRouter>
```

### Step 34 — `src/main.jsx` (Entry Point)
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## PHASE 9: Styling

### Step 35 — Add CSS
- Create a global `src/index.css` with base styles, colors, fonts
- Style each component/page (use CSS modules or plain CSS)
- Make it **responsive** for mobile

---

## PHASE 10: Testing & Deployment

### Step 36 — Test Full Flow
1. ✅ Register as a student
2. ✅ Register as a tutor
3. ✅ Login as tutor → create profile
4. ✅ Login as student → browse tutors → book a session
5. ✅ Login as admin → verify tutors, view stats

### Step 37 — Add `.gitignore`
Create `.gitignore` in root:
```
node_modules/
.env
client/dist/
```

### Step 38 — Push to GitHub
```bash
git add .
git commit -m "feat: implement home tution platform"
git push origin charansai
```

### Step 39 — Create Pull Request
Go to GitHub → Create a Pull Request from `charansai` → `main`

### Step 40 — Deploy (Optional)
- **Backend:** Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- **Frontend:** Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## 📊 Progress Tracker

| Phase   | Steps     | Status |
|---------|-----------|--------|
| Phase 1 | Steps 1-4   | ⬜ Not Started |
| Phase 2 | Steps 5-10  | ⬜ Not Started |
| Phase 3 | Steps 11-12 | ⬜ Not Started |
| Phase 4 | Steps 13-16 | ⬜ Not Started |
| Phase 5 | Steps 17-20 | ⬜ Not Started |
| Phase 6 | Steps 21-23 | ⬜ Not Started |
| Phase 7 | Steps 24-26 | ⬜ Not Started |
| Phase 8 | Steps 27-34 | ⬜ Not Started |
| Phase 9 | Step 35     | ⬜ Not Started |
| Phase 10| Steps 36-40 | ⬜ Not Started |

---

> 💡 **Tip:** Complete the **server first** (Phases 1-6), test with Postman, then build the **client** (Phases 7-9). This way you'll have working APIs before connecting the frontend.
