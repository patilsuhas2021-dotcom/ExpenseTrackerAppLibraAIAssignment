# SpendWise — Premium Full-Stack Expense Tracker

SpendWise is a production-ready, full-stack Expense Tracker application designed to help users log daily financial transactions, filter and query history, and gain spending insights through an interactive dashboard with light/dark theme persistence.

![Dashboard Preview](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80)

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
SpendWise/
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
   - `CLIENT_URL` (the Vercel frontend URL, e.g., `https://spendwise-tracker.vercel.app`)
