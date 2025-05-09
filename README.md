# Port Congestion Prediction Platform

This project is a full-stack web application for managing port operations and predicting port congestion using AI.

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Python 3.8+](https://www.python.org/) (for AI/congestion prediction)

---

## 1. Clone the Repository
Clone or copy the project folder to your PC.

```powershell
git clone <repository-url>
cd <project-folder>
```
Or simply copy the folder to your desired location.

---

## 2. Backend Setup (`server`)

1. Open a terminal and navigate to the `server` directory:
   ```powershell
   cd server
   ```
2. Install Node.js dependencies:
   ```powershell
   npm install
   ```
3. Install Python dependencies for AI:
   ```powershell
   pip install pandas numpy scikit-learn openpyxl
   ```
4. Place your Excel data files (`NAVIRES_tg_2024.xlsx` and `marchandise_TG_2024.xlsx`) in `server/data/`.
5. (Optional) Set up environment variables in `.env` (see `.env.example` if available).
6. Start the backend server:
   ```powershell
   npm start
   ```
   The backend should now be running at [http://localhost:3000](http://localhost:3000).

---

## 3. Frontend Setup (`FRONTEND`)

1. Open a new terminal and navigate to the `FRONTEND` directory:
   ```powershell
   cd FRONTEND
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```
   The frontend should now be running at [http://localhost:5173](http://localhost:5173).

---

## 4. AI Congestion Prediction (How it works)
- The backend exposes a POST API:
  - `POST /api/congestion/predict`
  - Body JSON: `{ "startDate": "YYYY-MM-DD", "days": N }`
  - Returns: List of daily congestion predictions
- The AI script uses the following formula:

```
congestion = (number of ships present × volume of goods handled) / port capacity
```
- `port capacity` is the daily handling capacity for goods (default: 10,000 colis/jour, configurable in the script).

---

## 5. Notes
- Make sure both backend and frontend servers are running for full functionality.
- If you encounter issues with ports, check your configuration files or change the default ports.
- For Windows users, all commands above work in PowerShell.

---

## 6. Additional Information
- For database setup or seeding, check the `server/seed.js` file and run as needed.
- For more details, refer to the code comments or contact the project maintainer.
- For AI/ML logic, see `server/ai/README.md`.
