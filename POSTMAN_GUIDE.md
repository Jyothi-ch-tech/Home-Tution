# 🧪 How to Test APIs in Postman — Step by Step

## Step 1: Install Postman
- Download from [postman.com/downloads](https://www.postman.com/downloads/)
- Install and open it (no sign-in required — click "Skip" if asked)

---

## Step 2: Your First Test — Health Check

1. Open Postman
2. Click the **"+"** button to create a new tab
3. You'll see a dropdown that says **GET** and a text box next to it
4. In the text box, type: `http://localhost:5000/api/health`
5. Click the blue **"Send"** button
6. You should see this response at the bottom:
```json
{
  "status": "ok",
  "message": "Home Tution API is running"
}
```
✅ If you see this, your server is working!

---

## Step 3: Register a Student

1. Click **"+"** for a new tab
2. Change **GET** to **POST** (click the dropdown)
3. URL: `http://localhost:5000/api/auth/register`
4. Click the **"Body"** tab (below the URL)
5. Select **"raw"**
6. Change the dropdown from "Text" to **"JSON"**
7. Paste this in the text area:
```json
{
  "name": "Charan Sai",
  "email": "charan@test.com",
  "password": "123456",
  "role": "student",
  "phone": "9876543210"
}
```
8. Click **"Send"**
9. You should get a response like:
```json
{
  "success": true,
  "data": {
    "_id": "some_long_id",
    "name": "Charan Sai",
    "email": "charan@test.com",
    "role": "student",
    "phone": "9876543210",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```
⚠️ **COPY THE TOKEN** — you'll need it for protected routes!

---

## Step 4: Register a Tutor

1. New tab → **POST** → `http://localhost:5000/api/auth/register`
2. Body → raw → JSON:
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@test.com",
  "password": "123456",
  "role": "tutor",
  "phone": "9876543211"
}
```
3. Click **Send**
4. **COPY THE TUTOR TOKEN** too!

---

## Step 5: Login

1. New tab → **POST** → `http://localhost:5000/api/auth/login`
2. Body → raw → JSON:
```json
{
  "email": "charan@test.com",
  "password": "123456"
}
```
3. Click **Send** → You'll get a token back

---

## Step 6: Using Token for Protected Routes

For any route that requires login, you need to add the token in **Headers**:

1. Click the **"Headers"** tab (below the URL)
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIs...` (paste your token after "Bearer ")

> ⚠️ There must be a SPACE between "Bearer" and the token!

### Example: Get Your Profile
1. **GET** → `http://localhost:5000/api/auth/profile`
2. Headers → Add `Authorization: Bearer YOUR_TOKEN_HERE`
3. Click **Send**

---

## Step 7: Create Tutor Profile (Login as Tutor first)

1. **POST** → `http://localhost:5000/api/tutors`
2. Headers → `Authorization: Bearer TUTOR_TOKEN_HERE`
3. Body → raw → JSON:
```json
{
  "subjects": ["Mathematics", "Physics"],
  "qualifications": "B.Tech, M.Tech",
  "experience": 3,
  "hourlyRate": 500,
  "location": "Hyderabad",
  "bio": "Experienced tutor specializing in Math and Physics for 10th and Intermediate students",
  "availability": ["Monday", "Wednesday", "Friday", "Saturday"]
}
```
4. Click **Send**
5. **COPY THE TUTOR `_id`** from the response — needed for bookings!

---

## Step 8: Get All Tutors (No token needed — Public)

1. **GET** → `http://localhost:5000/api/tutors`
2. Click **Send** — no headers needed!
3. You'll see all registered tutors

### Search/Filter Tutors:
- By subject: `http://localhost:5000/api/tutors?subject=Mathematics`
- By location: `http://localhost:5000/api/tutors?location=Hyderabad`
- By price range: `http://localhost:5000/api/tutors?minRate=200&maxRate=600`

---

## Step 9: Book a Tutor (Login as Student)

1. **POST** → `http://localhost:5000/api/bookings`
2. Headers → `Authorization: Bearer STUDENT_TOKEN_HERE`
3. Body → raw → JSON:
```json
{
  "tutor": "PASTE_TUTOR_ID_HERE",
  "subject": "Mathematics",
  "date": "2026-04-05",
  "time": "10:00 AM",
  "duration": 2,
  "notes": "Need help with calculus"
}
```
4. Click **Send**

---

## Step 10: View My Bookings

1. **GET** → `http://localhost:5000/api/bookings/mine`
2. Headers → `Authorization: Bearer YOUR_TOKEN_HERE`
3. Click **Send**

---

## 📋 Quick Reference — All API Endpoints

### Auth (Public)
| Method | URL | Body |
|--------|-----|------|
| POST | `/api/auth/register` | name, email, password, role |
| POST | `/api/auth/login` | email, password |

### Auth (Protected — need token)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/auth/profile` | Get my profile |
| PUT | `/api/auth/profile` | Update my profile |

### Tutors
| Method | URL | Auth? | Description |
|--------|-----|-------|-------------|
| GET | `/api/tutors` | No | List all tutors |
| GET | `/api/tutors/:id` | No | Get one tutor |
| POST | `/api/tutors` | Tutor | Create tutor profile |
| PUT | `/api/tutors/:id` | Tutor | Update tutor profile |
| DELETE | `/api/tutors/:id` | Tutor/Admin | Delete tutor profile |

### Bookings (All Protected)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/mine` | My bookings |
| PUT | `/api/bookings/:id` | Update booking status |
| DELETE | `/api/bookings/:id` | Cancel booking |

### Admin (Protected — admin only)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/users` | All users |
| DELETE | `/api/admin/users/:id` | Delete user |
| PUT | `/api/admin/tutors/:id/verify` | Verify tutor |
| GET | `/api/admin/stats` | Dashboard stats |

---

## 💡 Tips

- **Save your tokens** in Postman's Environment variables so you don't have to copy-paste every time
- If you get `"Not authorized, no token"` → you forgot to add the Authorization header
- If you get `"Not authorized as tutor"` → you're using a student token for a tutor-only route
- Always use **POST** for creating, **GET** for reading, **PUT** for updating, **DELETE** for removing
