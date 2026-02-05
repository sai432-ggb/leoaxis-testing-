#  QUICK START - COPY & PASTE COMMANDS

##  GET RUNNING IN 10 MINUTES



---

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

**What this does**: Downloads all required Node.js packages (Express, Mongoose, Bcrypt, JWT, Gemini AI, etc.)

---

### Step 2: Create `.env` File

Create a new file named `.env` in the `backend` folder (NOT .env.example, but .env)

**Copy this and paste into your .env file:**

```env
NODE_ENV=development
PORT=5000
MONGO_URI=PASTE_YOUR_MONGODB_URI_HERE
JWT_SECRET=leoaxis_jwt_secret_2024_production_key_very_secure_random_string
GEMINI_API_KEY=PASTE_YOUR_GEMINI_KEY_HERE
```

---

### Step 3: Get MongoDB URI

**Option A: MongoDB Atlas (Recommended - Free)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" → Create account
3. Create a FREE cluster (M0 Sandbox)
4. Click "Database Access" → "Add Database User"
   - Username: `leoaxis`
   - Password: `leoaxis123` (or any password)
   - Click "Add User"
5. Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
6. Click "Database" → "Connect" → "Connect your application"
7. Copy the connection string
8. **IMPORTANT**: Replace `<password>` with your actual password

**Your connection string should look like:**
```
mongodb+srv://leoaxis:leoaxis123@cluster0.abcde.mongodb.net/leoaxis_db?retryWrites=true&w=majority
```

**Paste this in your .env file** where it says `PASTE_YOUR_MONGODB_URI_HERE`

---

### Step 4: Get Gemini API Key

1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Click "Create API Key in new project"
4. Copy the key (starts with `AIza...`)
5. **Paste this in your .env file** where it says `PASTE_YOUR_GEMINI_KEY_HERE`

---

### Step 5: Seed Database (Add Sample Courses)

```bash
node seeder.js
```

**Expected Output:**
```
 MongoDB Connected
 Cleared existing courses
 3 courses seeded successfully

 Seeded Courses:
  - Python Programming Fundamentals (Beginner)
  - Data Structures and Algorithms (Intermediate)
  - Web Development with JavaScript (Beginner)

 Database seeding completed!
```

---

### Step 6: Start Server

```bash
npm run dev
```

**Expected Output:**
```
 MongoDB Connected: cluster0.abcde.mongodb.net
 Database: leoaxis_db
═══════════════════════════════════════════════════════
 Server running in development mode
 Server URL: http://localhost:5000
 API Base: http://localhost:5000/api
═══════════════════════════════════════════════════════
```

**Your backend is now LIVE!** 

---

##  TEST IT WORKS

### Option 1: Browser Test
Open your browser and go to:
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": " Leoaxis AI Learning Platform API",
  "version": "1.0.0",
  "status": "operational"
}
```

### Option 2: Test with Thunder Client (VS Code Extension)

1. Install "Thunder Client" extension in VS Code
2. Click Thunder Client icon in sidebar
3. Click "New Request"

**Test 1: Register a User**
```
Method: POST
URL: http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@leoaxis.com",
  "password": "Test@123",
  "phone": "9876543210"
}
```

Click "Send" → You should get a token!

**Test 2: Get All Courses**
```
Method: GET
URL: http://localhost:5000/api/courses
```

Click "Send" → You should see 3 courses!

---

## 🚀 DEPLOY TO RENDER (Make it Live on Internet)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Complete Leoaxis backend with AI"

# Create GitHub repo and connect
git remote add origin https://github.com/YOUR_USERNAME/leoaxis-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to https://render.com/ → Sign up/Login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Name**: `leoaxis-backend`
   - **Root Directory**: Leave empty (or type `backend` if you have frontend too)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Advanced" → Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = (your MongoDB Atlas URI)
   - `JWT_SECRET` = (your secret key)
   - `GEMINI_API_KEY` = (your Gemini key)
   - `PORT` = `5000`
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment

**Your live API URL will be:**
```
https://leoaxis-backend.onrender.com
```

---

## 📱 COMPLETE API ENDPOINTS

Once running, you have access to:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `GET /api/auth/stats` - Get user statistics (protected)

### Courses (`/api/courses`)
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses/:id/enroll` - Enroll in course (protected)
- `GET /api/courses/my-courses/enrolled` - Get my enrolled courses (protected)
- `GET /api/courses/:id/topics` - Get course topics (protected)
- `GET /api/courses/:courseId/topics/:topicId/quiz` - Get quiz (protected)
- `POST /api/courses/:courseId/topics/:topicId/quiz/submit` - Submit quiz (protected)

### AI (`/api/ai`)
- `POST /api/ai/analyze-quiz` - Get AI analysis of quiz performance (protected)
- `GET /api/ai/learning-path` - Get personalized learning path (protected)
- `POST /api/ai/doubt` - Ask AI to resolve doubts (protected)

---

## ❌ TROUBLESHOOTING

### Error: "Cannot find module 'express'"
**Solution**: Run `npm install` in the backend folder

### Error: "MongooseError: Connection failed"
**Solution**: 
1. Check your MONGO_URI in .env
2. Make sure you replaced `<password>` with actual password
3. Check MongoDB Atlas Network Access (should allow 0.0.0.0/0)

### Error: "JWT secret not defined"
**Solution**: Make sure JWT_SECRET is set in .env file

### Error: "Gemini API Error"
**Solution**: 
1. Check GEMINI_API_KEY in .env
2. Make sure key starts with "AIza"
3. No extra spaces in the key

### Port Already in Use
**Solution**: 
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env to 5001
```

---

## 📚 WHAT YOU HAVE

✅ Complete authentication system with JWT
✅ User registration, login, profile management
✅ Course browsing with filters
✅ Course enrollment system
✅ Quiz system with instant grading
✅ AI-powered quiz analysis (Gemini integration)
✅ Personalized learning recommendations
✅ User progress tracking
✅ Points and streak system
✅ 3 sample courses pre-loaded
✅ Production-ready code
✅ Docker support
✅ Deployment ready

---

## 🎯 NEXT STEPS

1. ✅ Get backend running locally (10 mins)
2. ✅ Test with Thunder Client (5 mins)
3. ✅ Deploy to Render (15 mins)
4. 📱 Build React frontend (if needed)
5. 🎨 Add more courses
6. 🚀 Share with team

---

**Need help? Check the detailed README.md or ask me!** 🚀