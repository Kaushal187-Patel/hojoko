# HOZOKO

HOZOKO is a full-stack ecommerce application with a Next.js storefront and an Express REST API backed by MongoDB. It includes shopper and admin flows, JWT authentication with HTTP-only cookies, Razorpay checkout, and a responsive editorial UI.

## Tech Stack

### Frontend
- Next.js App Router
- React
- Redux Toolkit
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- Razorpay
- Helmet
- Express Rate Limit
- CORS

## Project Structure

```text
frontend/
  app/
  components/
  redux/
  services/
  utils/
  styles/

backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  uploads/
```

## Features

### User
- Signup and login
- JWT authentication
- User dashboard
- Product listing and product details
- Product search
- Cart add, update, and remove
- Checkout
- Order history
- User profile
- Responsive UI

### Admin
- Admin login
- Admin dashboard
- Add, edit, and delete products
- Manage orders
- Manage users
- Dashboard analytics

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

### Orders
- `GET /api/orders`
- `POST /api/orders`
- `POST /api/orders/verify`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`

### Additional Routes
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/categories`
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/health`

## Getting Started

### Prerequisites
- Node.js 18 or later
- MongoDB Atlas or a local MongoDB instance
- Razorpay test keys for checkout testing

### 1. Clone the repository

```bash
git clone https://github.com/Kaushal187-Patel/hojoko.git
cd hojoko
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your MongoDB URI, JWT secret, `CLIENT_URL` (use `http://localhost:3000` for local Next.js), Razorpay credentials, and for **forgot password emails** your Resend API key (see `backend/.env.example`).

Install dependencies and seed demo data:

```bash
npm install
npm run seed
npm run dev
```

The API runs on `http://localhost:5000`. In **development**, after a successful forgot-password request for a real user, the **reset link is printed in this terminal** even if email also sends—handy for quick local testing.

### 3. Configure the frontend

Open a new terminal:

```bash
cd frontend
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend API URL and add your Razorpay public key.

Install dependencies and start the app:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

For production:

```bash
npm run build
npm start
```

## Demo Accounts

After running the seed script:

- Admin username: `admin@hozoko.com`
- Admin password: `Admin@123`
- Demo user username: `user@hozoko.com`
- Demo user password: `User@123`

## Environment Variables

### Backend
- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `CLIENT_URL` (frontend origin; reset links use this URL)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- **Password reset emails (recommended: [Resend](https://resend.com))**: `RESEND_API_KEY`; optional `RESEND_FROM` or `EMAIL_FROM` (use a verified domain in production—or Resend's test sender `onboarding@resend.dev` for development)
- SMTP alternative (omit `RESEND_API_KEY`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

### Frontend
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## Deployment

### Frontend
Deploy the `frontend` app to Vercel.

Set:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Backend
Deploy the `backend` app to Render or Railway.

Set all backend environment variables and point `CLIENT_URL` to your deployed frontend URL.

### Database
Use MongoDB Atlas and place the connection string in `MONGODB_URI`.

## Security Notes

- Passwords are hashed with bcryptjs.
- Protected routes use JWT stored in HTTP-only cookies.
- Helmet and rate limiting are enabled on the API.
- Do not commit `.env` files. Only commit `.env.example`.

## Repository

GitHub: [https://github.com/Kaushal187-Patel/hojoko](https://github.com/Kaushal187-Patel/hojoko)
