# ⚽ FOOTBALL HUB

A modern full-stack football platform that combines football equipment e-commerce, field booking, community matchmaking, and admin management into a single ecosystem.

This project was built as a **full-stack portfolio application** to demonstrate real-world system design, authentication, role-based access control, RESTful API development, database modeling, and secure backend architecture.

---

# 🚀 Why this project?

Football Hub simulates a real-world football ecosystem where users can:
- Purchase football equipment
- Book football fields with conflict prevention
- Create and join community matches
- Manage orders and bookings
- Administer the entire platform through a secure dashboard

It demonstrates how multiple business domains (e-commerce + booking + community system) interact in one scalable full-stack application.

---

# ✨ Features

## 👤 User Features
- User registration & login (JWT authentication)
- Browse football products with search & filters
- Product details with size & quantity selection
- Shopping cart (persistent via local storage)
- Checkout & order creation
- Football field browsing & booking system
- Booking conflict prevention system
- Community match posting & join requests
- User profile with order & booking history
- Responsive UI (Desktop / Tablet / Mobile)
- Multi-language support (Thai / English)
- PWA support

---

## 🛠️ Admin Features
- Admin authentication & role-based access control
- Dashboard overview
- Product management (CRUD)
- Order management
- Field management
- Booking management
- Community moderation tools

---

# 🧱 Tech Stack

## Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Context API

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt password hashing

---

# 🏗️ Architecture

```text
Frontend (React + Vite)
        ↓
REST API (Express.js)
        ↓
MongoDB Atlas