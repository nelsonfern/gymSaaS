# 🏋️‍♂️ GymSaaS

**A Complete Modern SaaS Solution for Gyms and Health Clubs**

GymSaaS is a comprehensive, full-stack web application designed to help gym owners manage their facilities with ease. Built with performance and user experience in mind, this platform handles everything from member check-ins and payments to insightful analytics and staff management.

---

## ✨ Features

- **👥 Client Management**: Easily register and manage gym members, their personal data, and current status.
- **💳 Memberships & Payments**: Set up custom billing plans (daily, monthly, yearly), track member payments, and auto-manage expirations.
- **✅ Access Control (Check-In)**: A dedicated system for member check-in that automatically validates active memberships and daily limits.
- **🔐 Role-Based Access (RBAC)**: Supports `Admin` and `Staff` roles. Keep your sensitive financial data visible only to the administrators.
- **📊 Analytics & Reports**: Powerful dashboard with interactive charts (Recharts) to visualize revenue, active members, and check-in trends.
- **⚙️ Deep Customization**: Dynamically update your gym's logo, name, currency, and contact information straight from the UI.
- **📧 Automated Emails**: Built-in email integration using Nodemailer (supports Gmail, Resend, etc.) for member onboarding and updates.
- **🕰️ Automated Background Jobs**: Uses `node-cron` to automatically verify member statuses and expire plans when their time runs out.
- **🐳 Docker Ready**: Easily deploy anywhere with pre-configured Dockerfiles and `docker-compose.yml`.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (for smooth animations)
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Icons & Charts**: Lucide React / Recharts
- **Forms & Data**: React Hook Form, Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT Authentication, bcrypt, Express Rate Limit, Helmet, Mongo Sanitize
- **Utilities**: Multer (file uploads), Nodemailer, node-cron

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher)
- **MongoDB** (running locally, or a MongoDB Atlas connection string)
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/nelsonfern/gymSaaS.git
cd gymSaaS
```

### 2. Environment Variables

You need to configure the `.env` variables for both the client and the server.

Create a `.env` file in the `/server` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gymdb
JWT_SECRET=your_super_secret_key_here
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM_NAME="GymSaaS"
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Installation & Run (Local Development)

**Running the Server:**
```bash
cd server
npm install
npm run dev
```

**Running the Client:**
```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

---

## 🐳 Docker Deployment (Optional)

GymSaaS comes with a `docker-compose.yml` file for quick setup and deployment. Ensure you have Docker and Docker Compose installed.

```bash
# Build and run the containers in detached mode
docker-compose up --build -d
```
This will spin up both the Frontend, Backend, and a MongoDB container automatically.

---

## 📂 Project Structure

```text
gymSaaS/
├── client/                 # React Frontend application
│   ├── src/
│   │   ├── api/            # Axios configurations
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── layouts/        # App Layouts and Sidebar
│   │   ├── pages/          # Application views (Dashboard, Settings, Config, etc.)
│   │   └── store/          # Zustand State Stores
│   └── dockerfile          # Client Docker configuration
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB Connection setups
│   ├── controllers/        # Business logic for endpoints
│   ├── helpers/            # Utilities and JWT middlewares
│   ├── jobs/               # Cron jobs (membership status update)
│   ├── models/             # Business logic abstractions
│   ├── routes/             # Express API routes
│   ├── schemas/            # Mongoose schemas
│   ├── services/           # Mailers and 3rd party integrations
│   └── dockerfile          # Backend Docker configuration
└── docker-compose.yml      # Orchestrates all containers
```

---

## 🛡️ Security
This project uses:
- **Helmet** to secure Express apps by setting various HTTP headers.
- **Express Mongo Sanitize** to prevent MongoDB Operator Injection.
- **Express Rate Limit** to prevent brute-force attacks on sensitive endpoints.
- **JWT HTTP-Only Cookies** (if configured) or Bearer tokens for safe authentication.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/nelsonfern/gymSaaS/issues).

## 📝 License
This project is licensed under the ISC License.
