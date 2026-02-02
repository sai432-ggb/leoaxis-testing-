# 🛠️ Developer Setup Guide

Follow these steps to run the Leoaxis Platform locally.

### 1. Prerequisites
* Node.js (v18+)
* Docker Desktop (Optional, for containerized run)
* Git

### 2. Installation
**Clone the repository:**
```bash
git clone [https://github.com/YOUR_USERNAME/leoaxis-platform.git](https://github.com/YOUR_USERNAME/leoaxis-platform.git)
cd leoaxis-platform
You are in the final lap! You accidentally deployed a "Starter Template" on Vercel, but your actual code is safe in your folder.

Here is the Complete "Fix & Finish" Pack. This will fix your git settings, generate professional documentation for your team, and push everything to GitHub correctly so you can redeploy the correct site.

Step 1: Create the .gitignore File
This file prevents you from accidentally uploading massive folders (like node_modules) or secrets (like .env) to GitHub.

Create a file named .gitignore in your main leoaxis-platform folder:

Plaintext
# Dependencies
node_modules/

# Environment Variables (Keep these secret!)
.env

# Build Outputs
build/
dist/

# System Files
.DS_Store
Step 2: Create README.md (The "Face" of your Project)
This is what your team will see when they open the GitHub link. It makes you look like a pro.

Create a file named README.md in the main folder:

Markdown
# 🚀 Leoaxis Technologies - AI Learning Platform

### **Industry-Ready AI-Powered Education Ecosystem**

This platform bridges the gap between academic learning and industry standards. It features an automated evaluation system, AI-driven career mentorship, and a full-stack MERN architecture.

---

## 🏗️ Tech Stack
* **Frontend:** React.js (Create React App), CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Cloud)
* **AI Engine:** Google Gemini Pro API
* **DevOps:** Docker, GitHub Actions (CI/CD), Render, Vercel

---

## ✨ Key Features
1.  **AI Career Architect:** Analyzes quiz performance to suggest personalized learning paths.
2.  **Real-Time Code Evaluation:** Automated grading for C, C++, Python, and DSA.
3.  **Secure Architecture:** JWT Authentication and Bcrypt password hashing.
4.  **Global Deployment:** Auto-scaling backend on Render and global CDN frontend on Vercel.

---

## 📂 Project Structure
* `/frontend` - React User Interface and Dashboard
* `/backend` - Node.js API and AI Integration Logic
* `.github/workflows` - CI/CD Pipelines

---

## 🚀 Live Demo
* **Frontend:** [Add your Vercel Link Here]
* **Backend API:** https://leoaxis-backend.onrender.com
Step 3: Create SETUP.md (For the Team)
This explains to your team how they can run your code on their own laptops.

Create a file named SETUP.md in the main folder:

Markdown
# 🛠️ Developer Setup Guide

Follow these steps to run the Leoaxis Platform locally.

### 1. Prerequisites
* Node.js (v18+)
* Docker Desktop (Optional, for containerized run)
* Git

### 2. Installation
**Clone the repository:**
```bash
git clone https://github.com/sai432-ggb/leoaxis-testing-.git
cd leoaxis-platform
Install Backend:
cd backend
npm install
Install Frontend:
cd ../frontend
npm install
Option A: Using Docker (Recommended)

Bash
docker-compose up --build
Option B: Manual Start

Terminal 1 (Backend): cd backend && npm start

Terminal 2 (Frontend): cd frontend && npm start