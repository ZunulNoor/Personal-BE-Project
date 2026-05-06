# Personal-BE-Project: Interactive Chat & User Management API

A robust Node.js Express backend specializing in secure user authentication, modular validation, and country-aware data handling.

## 🚀 What We Built Today

### ✅ 1. Advanced Country API
- **Endpoint:** Created `GET /api/get-countries` in a dedicated `API/Country` module.
- **Filtering Support:** Implemented multi-field filtering (AND logic) for:
  - `countryName` (Partial/Case-insensitive)
  - `shortCountryName` (ISO Code)
  - `phoneCode` (Dialing prefix)
  - `region` (Geographic area)
- **Pagination:** Added `size` parameter to limit results.
- **Strict Validation:** Implemented checks to reject unsupported query parameters and invalid size values.

### 🔐 2. Security Improvements (Brute Force Protection)
- **Problem:** Protected against brute force attacks where automated scripts attempt to guess passwords or OTP codes through repeated attempts.
- **Solution:** Integrated `express-rate-limit` to implement request throttling.
- **Rate Limiting:** 
  - 5 requests per 1-minute window per IP.
  - Custom error messaging for blocked users.
- **Protected Routes:** Applied specifically to sensitive endpoints: `/login`, `/verify-otp`, and `/create-account`.
- **Outcome:** Significantly reduced risk of credential guessing, OTP spamming, and automated account abuse.

### ⚙️ 3. Authentication Flow Improvements
- **OTP System:** Robust OTP-based login system with temporary token verification before final JWT issuance.
- **Password Standards:** Enforced complex password rules (Uppercase, Lowercase, Number, Special Character, Min 6 characters).
- **Secure Hashing:** Continued use of `bcryptjs` for industry-standard password security.

### 🌍 4. Country-Based Validation System
- **Dynamic Phone Validation:** Phone formats are now validated against a comprehensive dataset of ~240 countries.
- **E.164 Format:** Enforced strict international format (e.g., `+923433312614`) for database storage.
- **Cross-Validation:** Automatically matches the phone dialing code and length against the user's selected country.

### 📌 5. Validation System Upgrade
- **Modular Design:** Centralized all validation logic into `API/validation/` and `API/utils/`.
- **Invisible Character Detection:** Implemented detection and rejection of invisible Unicode characters (U+200B, etc.) to prevent security bypasses and data corruption.
- **Granular Error Reporting:** Detailed feedback for each validation failure (e.g., specific missing password requirements).

### 🧩 6. Architecture & Scalability
- **Modular Structure:** Clean separation of concerns between Controllers, Routers, Models, Validation helpers, and Middlewares.
- **Project Structure:**
  - `API/Country`: Country-specific data and routes.
  - `API/User`: User account and authentication logic.
  - `API/middleware`: Reusable logic like authentication and rate limiting.
  - `API/utils`: Helper functions and static datasets (countries.json).
  - `API/validation`: Schema-specific validation layers.

---

## Technical Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** JWT, bcryptjs, express-rate-limit
- **Communication:** Socket.io, Nodemailer

## Development Setup
1. Clone the repository.
2. Run `npm install`.
3. Configure `.env` with `MONGO_URI`, `SECRET_KEY`, `MAIL_USER`, and `MAIL_PASS`.
4. Run `npm run dev` to start the development server.
