# Sweet Shop Frontend (Client)

React + Vite SPA for the Sweet Shop application. Uses React Router, Tailwind CSS (v4 via `@tailwindcss/vite`), and Axios.

## Prerequisites

- Node.js 18+
- Backend API running (see `server/` folder). Default expects `http://localhost:5000`.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables (optional if using default localhost):

   - Copy `.env.example` to `.env` (or `.env.local`) and adjust as needed.

   ```bash
   cp .env.example .env
   # then edit .env
   ```

   Available vars:
   - `VITE_API_URL` – Base URL of the backend API (e.g., `http://localhost:5000`).

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Features

- Authentication (Register, Login) with JWT persistence (LocalStorage)
- Protected routes via `src/components/ProtectedRoute.jsx`
- Sweets listing with search and price filters
- Purchase sweet (button disabled when quantity is 0)
- Admin panel to add, update, delete, and restock sweets

## Key Files

- `src/context/AuthContext.jsx` – Auth state and helpers
- `src/services/api.js` – Axios instance (attaches JWT)
- `src/services/auth.js` – Register/Login API calls
- `src/services/sweets.js` – Sweets API calls
- `src/pages/` – Views (`Login`, `Signup`, `Dashboard`, `Admin`)
- `src/components/ProtectedRoute.jsx` – Route guard
- `src/index.css` – Tailwind import and custom utilities

## Tailwind CSS

Tailwind v4 is integrated using `@tailwindcss/vite` in `vite.config.js`. CSS utilities are available via `@import "tailwindcss";` at the top of `src/index.css`. Some additional custom utility classes are defined at the bottom of `src/index.css` for the app's gradient and brand colors.

## Notes

- This client expects the backend endpoints as described in the project requirements (e.g., `/api/auth/register`, `/api/auth/login`, `/api/sweets`, etc.). Ensure CORS is enabled on the server during development.

