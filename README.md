# Food Delivery App

A full-stack food ordering web app built with the MERN stack.

## Features
- Customer-facing food ordering experience
- Cart and checkout flow
- User authentication with JWT
- Admin panel for managing food items and orders
- Stripe and Razorpay payment support

## Tech Stack
- Frontend: React, Vite, React Router
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Payments: Stripe, Razorpay

## Project Structure
- frontend: customer app
- admin: admin dashboard
- backend: API server

## Local Setup
### Prerequisites
- Node.js
- npm
- MongoDB

### Backend
```bash
cd backend
npm install
npm start
```

Create a `.env` file in the backend folder and add values such as:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin
```bash
cd admin
npm install
npm run dev
```

## Deployment
This project is ready for deployment on platforms such as:
- Vercel for the frontend
- Render or Railway for the backend
- MongoDB Atlas for the database

Set the frontend environment variable:
```env
VITE_API_URL=https://your-backend-url
```

## Notes
- Do not commit your `.env` file.
- For production, use real payment keys and a hosted MongoDB instance.

## License
This project is for learning and personal use.


