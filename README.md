# MediBook - Doctor Appointment Management System

Enterprise-grade healthcare appointment management platform built with Next.js 15, Express.js, and MongoDB.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion, Shadcn-inspired UI
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB Atlas, Mongoose ODM
- **Auth:** JWT, Role-Based Access Control (Admin, Doctor, Patient)
- **Payments:** Stripe, Razorpay, PayPal ready
- **Email:** Nodemailer (appointment confirmation, reminders, password reset)
- **Security:** Helmet, CORS, Rate Limiting, bcrypt, Input Validation

## Features

### Patient
- Registration, Login, Forgot Password
- Dashboard with appointment overview
- Doctor search & filter by specialization, rating, fees
- Live slot booking with date/time picker
- Appointment management (book, cancel, reschedule)
- Payment history & invoices
- Medical history tracking
- Profile management

### Doctor
- Dashboard with stats
- Manage availability (day/time slots)
- Approve/reject appointments
- Add prescriptions & consultation notes
- View patient details

### Admin
- Dashboard analytics (revenue, appointments, users)
- Manage doctors (approve/unapprove)
- Manage patients (activate/deactivate)
- Manage departments (CRUD)
- Manage all appointments
- Payment management & refunds
- Review moderation
- Contact form management
- Website settings

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and other config
npm install
npm run seed    # Seeds demo data
npm run dev     # Starts on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev     # Starts on http://localhost:3000
```

### Demo Accounts (after seeding)
| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Admin   | admin@medibook.com     | password123  |
| Doctor  | sarah@medibook.com     | password123  |
| Patient | patient@medibook.com   | password123  |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password

### Doctors
- `GET /api/doctors` - List (public, with filters)
- `GET /api/doctors/:id` - Get doctor
- `PUT /api/doctors/profile` - Update profile (doctor)
- `PUT /api/doctors/availability` - Update availability (doctor)
- `GET /api/doctors/stats` - Doctor stats

### Appointments
- `POST /api/appointments` - Create (patient)
- `GET /api/appointments/my` - Patient appointments
- `GET /api/appointments/doctor` - Doctor appointments
- `GET /api/appointments/slots?doctorId=&date=` - Check slots
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id/prescription` - Add prescription

### Payments
- `POST /api/payments/stripe` - Create Stripe payment
- `POST /api/payments/razorpay` - Create Razorpay order
- `GET /api/payments/history` - Payment history

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- CRUD for departments, reviews, contacts, settings

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Render / Railway
1. Set environment variables from `.env.example`
2. Set start command: `node src/server.js`
3. Set build command: `npm install`

### Database → MongoDB Atlas
1. Create cluster at mongodb.com
2. Get connection string
3. Set `MONGO_URI` in backend `.env`

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth, error, validation
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Email, helpers
│   │   └── server.js     # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # UI & layout components
│   │   ├── hooks/        # Custom hooks (auth, etc.)
│   │   ├── lib/          # API client, utils
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

## License

MIT
