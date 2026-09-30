# 🍽️ Restaurant Management System (Quick Start Guide)

A full-stack project built with **ReactJS, Node.js + Express, and MySQL**. Follow the instructions below to set up and run the application locally.

---

## 📥 Prerequisites (What You Need to Install)

Before running the project, ensure you have the following software installed on your computer:
1. **Node.js** (LTS Version) -> [Download here](https://nodejs.org)
2. **MySQL Server & MySQL Workbench** -> [Download here](https://mysql.com)

---

## 🚀 Step-by-Step Launch Instructions

### Step 1: Set Up the Database
1. Open **MySQL Workbench** and connect to your local server.
2. Open and run the **`schema.sql`** file found in the root of this project folder to automatically create the database and required tables.

### Step 2: Start the Backend Server
1. Open your terminal or command prompt and navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Open `db.js` in a text editor and update the `password` field to match your local MySQL root password.
4. Run the server:
   ```bash
   npm start
   ```
   *(Keep this terminal open. The server will run on port `5000`)*.

### Step 3: Start the React Frontend
1. Open a **brand new, second terminal window** and navigate into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Boot up the React web application:
   ```bash
   npm run dev
   ```
4. Open your browser and go to the link shown in your terminal (usually **`http://localhost:5173`**).

---
Developed for Semester 5 Project Evaluation. All core code handles database actions dynamically.
