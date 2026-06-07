# Expense Tracker — Premium Full-Stack Expense Tracker

Expense Tracker is a production-ready, full-stack Expense Tracker application designed to help users log daily financial transactions, filter and query history, and gain spending insights through an interactive dashboard with light/dark theme persistence.

---

## Key Features

1. **JWT User Authentication**
   - Secure registration and login.
   - Credentials hashed using bcrypt.
   - Protected API routes and React Router client guards using tokens stored in `localStorage`.
2. **Interactive Financial Insights**
   - KPI metric cards showing Total Expense, Current Month Expense, and Top Category.
   - **Pie Chart (Category-wise breakdown):** Visual distribution of spending across 9 categories.
   - **Line Chart (Monthly Trend):** Spending pattern analysis for the last 6 months.
3. **Robust Expense Management (CRUD)**
   - Add, edit, and delete transactions using an inline, validated modal form.
   - Dynamic search by title or category.
   - Advanced filters (Category dropdown, Start and End Date ranges).
   - Server-side paginated results.
4. **Persistent Theme Toggle**
   - Toggle between Light and Dark mode.
   - Preferred theme persists on page reload and syncs with the authenticated user profile.
5. **Database Seeding**
   - Pre-populated mock data utility covering the last 6 months for immediate visual testing of charts.

---

## Tech Stack

### Frontend
- **React.js** (Vite bundler, React 19)
- **React Router DOM** (Single Page Application routing)
- **Recharts** (SVG charts library)
- **Axios** (API requests with automatic interceptors)
- **Tailwind CSS v3** (Utility-first styles with dark mode configurations)
- **Lucide React** (Modern iconography)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (Web application framework)
- **Mongoose / MongoDB** (NoSQL Database model and aggregation pipelines)
- **Express-Validator** (Request body verification)
- **JSON Web Tokens (JWT) & BcryptJS** (Secure session validation & hashing)

---

## Directory Structure

```
Expense Tracker/
 ├── server/             # Express.js Backend
 │    ├── config/        # Mongoose Database configuration
 │    ├── models/        # User and Expense MongoDB Mongoose models
 │    ├── middleware/    # Auth token validations
 │    ├── controllers/   # Auth, Expense, and Dashboard business logic
 │    ├── routes/        # Router endpoint mappings
 │    ├── validations/   # Express-validator input verification
 │    ├── scripts/       # Seeding databases scripts
 │    └── .env           # Backend environmental variables
 ├── frontend/           # React Client (Vite)
 │    ├── src/
 │    │    ├── components/ # Navbar, SummaryCards, Charts, Tables, Forms
 │    │    ├── pages/      # Login, Register, Dashboard views
 │    │    ├── context/    # AuthContext, ThemeContext
 │    │    ├── services/   # Axios API requests
 │    │    ├── hooks/      # useAuth, useTheme context access
 │    │    └── utils/      # Formatting tools
 │    └── index.html     # HTML entry point
 ├── .env.example        # Env configuration template
 ├── .gitignore          # Git exclusion specifications
 └── README.md           # Main documentation
```

---

## Getting Started

Follow these steps to run the application locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or an Atlas connection string)

### 1. Database Configuration
Ensure your MongoDB service is running locally on the default port:
```bash
# Verify MongoDB port locally
mongod --version
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` in the root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense_tracker
   JWT_SECRET=super_secret_key_minimum_32_characters
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. Seed the database with demonstration data:
   ```bash
   npm run seed
   ```
   *Note: This creates a demo account `demo@example.com` / `password123` with 6 months of logged expenses.*
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*
4. Open your browser and navigate to `http://localhost:5173`. Log in using `demo@example.com` / `password123` to immediately view the populated dashboard.

---

## API Documentation

All routes expect header: `Authorization: Bearer <JWT_TOKEN>` for protected routes.

### Authentication Endpoints
- **Register User**
  - `POST /api/auth/register`
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - Response: `{ "success": true, "token": "<JWT_TOKEN>", "user": { "id": "...", "name": "John Doe", ... } }`
- **Login User**
  - `POST /api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "password123" }`
  - Response: `{ "success": true, "token": "<JWT_TOKEN>", "user": { ... } }`
- **Sync Theme Preference**
  - `PUT /api/auth/theme` (Protected)
  - Body: `{ "theme": "dark" }`
  - Response: `{ "success": true, "themePreference": "dark" }`

### Dashboard Endpoints
- **Fetch Dashboard Statistics**
  - `GET /api/dashboard` (Protected)
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "totalExpenses": 1850.50,
        "monthlyExpenses": 450.20,
        "recentTransactions": [ ... ],
        "categoryBreakdown": [ { "category": "Food", "amount": 620.00 }, ... ],
        "monthlyTrend": [ { "month": "Jan 2026", "amount": 320.00 }, ... ]
      }
    }
    ```

### Expense Endpoints
- **Get Paginated Expenses (with optional filters/search)**
  - `GET /api/expenses` (Protected)
  - Query Params: `search`, `category`, `startDate`, `endDate`, `page`, `limit`
  - Response: `{ "success": true, "pagination": { "totalRecords": 35, "totalPages": 4, ... }, "expenses": [ ... ] }`
- **Create Expense**
  - `POST /api/expenses` (Protected)
  - Body: `{ "title": "Internet Subscription", "amount": 59.99, "category": "Bills & Utilities", "paymentMethod": "Credit Card", "expenseDate": "2026-06-06T00:00:00.000Z" }`
  - Response: `{ "success": true, "expense": { ... } }`
- **Get Expense By ID**
  - `GET /api/expenses/:id` (Protected)
- **Update Expense**
  - `PUT /api/expenses/:id` (Protected)
  - Body: `{ "title": "Updated Title", "amount": 80.00 }`
- **Delete Expense**
  - `DELETE /api/expenses/:id` (Protected)

---

## Deployment Guidelines

### Frontend (Vercel / Netlify)
1. Set the root directory of the deployment project to `frontend/`.
2. Configure build script command: `npm run build`.
3. Configure output directory: `dist`.
4. Set the environment variable `VITE_API_URL` to point to your deployed backend (e.g., `https://your-backend-api.onrender.com`).

### Backend (Render / Railway)
1. Set the root directory of the deployment project to `server/`.
2. Set build command: `npm install`.
3. Set start command: `npm start`.
4. Add environment variables:
   - `PORT=5000` (Render binds port automatically)
   - `MONGODB_URI` (your production MongoDB Atlas URL)
   - `JWT_SECRET` (a strong production random secret)
   - `CLIENT_URL` (the Vercel frontend URL, e.g., `https://Expense Tracker-tracker.vercel.app`)

---

### Screenshots of ExpenseTracker

#### 1. LOGIN PAGE (BONUS)
<img width="940" height="434" alt="image" src="https://github.com/user-attachments/assets/1f4ed949-12df-401d-95b8-0dbb79c28a47" />

#### 2. REGISTRATION PAGE (BONUS)
<img width="940" height="508" alt="image" src="https://github.com/user-attachments/assets/f191ce9d-c03e-4049-b7b3-26b17ee01be2" />
<img width="940" height="501" alt="image" src="https://github.com/user-attachments/assets/9d119885-6f9b-467d-8cce-3fbc7f824876" />

#### 3. DASHBOARD OVERVIEW
<img width="940" height="490" alt="image" src="https://github.com/user-attachments/assets/3d65bd1f-11d6-45d2-89cb-7773d85c2d05" />
<img width="940" height="461" alt="image" src="https://github.com/user-attachments/assets/a1099ebd-ef9d-488b-99eb-a7d2edafeb85" />

#### 4. ADD NEW EXPENSE
<img width="520" height="526" alt="image" src="https://github.com/user-attachments/assets/80e37423-eaa9-49bb-afc0-3f62f6b483f8" />
<img width="940" height="502" alt="image" src="https://github.com/user-attachments/assets/114e9535-54cd-4401-8870-b5c7512f14c2" />
<img width="940" height="370" alt="image" src="https://github.com/user-attachments/assets/a7423c06-5e8e-46c8-82b1-fa2eb78ae1e2" />

#### 5. EDIT EXPENSE
<img width="622" height="623" alt="image" src="https://github.com/user-attachments/assets/3e1caf4c-41db-48bf-9005-5b6d70b2c42b" />

#### 6. DELETE EXPENSE
<img width="940" height="503" alt="image" src="https://github.com/user-attachments/assets/7d7a6451-2af3-4d8a-89c1-693cd70a597b" />

#### 7. VIEW EXPENSE HISTORY
<img width="940" height="469" alt="image" src="https://github.com/user-attachments/assets/bb48bf61-0bc3-4bf8-afa8-6776be3f6b0b" />
<img width="940" height="484" alt="image" src="https://github.com/user-attachments/assets/0c24a67a-2279-4c48-8d33-0bd85e246d58" />

#### 8. FORM VALIDATIONS
<img width="654" height="728" alt="image" src="https://github.com/user-attachments/assets/37290c9a-4b3d-4ee8-b2a4-1c6776a032f2" />
<img width="650" height="817" alt="image" src="https://github.com/user-attachments/assets/92550672-8de3-4764-92e7-0607e7707912" />

#### 9. SEARCH AND FILTER FEATURES:
➔	SEARCH BY TITLE
<img width="940" height="368" alt="image" src="https://github.com/user-attachments/assets/1704d0c3-b772-4f73-a46b-2314da1e08f2" />
➔	SEARCH BY CATEGORY
<img width="940" height="365" alt="image" src="https://github.com/user-attachments/assets/570b29ec-ac14-4689-b387-b77f63ee2e9a" />
➔	SEARCH BY ALL CATEGORIES
<img width="940" height="486" alt="image" src="https://github.com/user-attachments/assets/330a058b-afd3-4b63-b2db-b525ee354e82" />

#### 10. PAGINATION
<img width="940" height="253" alt="image" src="https://github.com/user-attachments/assets/f5654ef1-0e5e-465a-8e12-a5348680e61e" />

#### 11. BONUS FEATURES
•	Authentication (JWT Login/Register)
<img width="940" height="433" alt="image" src="https://github.com/user-attachments/assets/b4961a64-f0c4-431e-bc0a-51bd93deed19" />

•	Expense Chart: Pie Chart (Category-wise Expenses)
<img width="940" height="408" alt="image" src="https://github.com/user-attachments/assets/d39a2603-b8e2-45bf-ae80-07c1df65cba7" />

•	Dark Mode
<img width="940" height="245" alt="image" src="https://github.com/user-attachments/assets/8d30e79b-02e8-4c97-a140-26f1b487494e" />

•	Light Mode
<img width="940" height="272" alt="image" src="https://github.com/user-attachments/assets/f5a37f54-7341-4b09-b791-d28c0a586be9" />
