# Project Setup Guide

This guide explains how to set up and run the project (frontend and backend) on another PC.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## 1. Clone the Repository
Clone or copy the project folder to your PC.

```
# Example using git (if hosted on a repository)
git clone <repository-url>
cd <project-folder>
```
Or simply copy the folder to your desired location.

---

## 2. Backend Setup (server)

1. Open a terminal and navigate to the `server` directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. (Optional) Set up environment variables if required (e.g., `.env` file).
4. Start the backend server:
   ```
   npm start
   ```
   The backend should now be running (default: http://localhost:5000 or as configured).

---

## 3. Frontend Setup (FRONTEND)

1. Open a new terminal and navigate to the `FRONTEND` directory:
   ```
   cd FRONTEND
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend should now be running (default: http://localhost:5173 or as configured).

---

## 4. Notes
- Make sure both backend and frontend servers are running for full functionality.
- If you encounter issues with ports, check your configuration files or change the default ports.
- For Windows users, all commands above work in Command Prompt or PowerShell.

---

## 5. Additional Information
- For database setup or seeding, check the `server/seed.js` file and run as needed.
- For more details, refer to the code comments or contact the project maintainer.
