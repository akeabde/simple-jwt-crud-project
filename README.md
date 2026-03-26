# Full-Stack JWT CRUD Application

A beginner-friendly, educational full-stack web application demonstrating secure user authentication, role-based access control (Admin/User), and CRUD operations for managing human resources (Persons).

## 🚀 Overview

This project is designed as a learning resource for understanding the core concepts of modern web development, particularly focusing on:
- **Authentication:** Implementation of JSON Web Tokens (JWT).
- **Security:** Password hashing using `bcryptjs`.
- **Database Architecture:** Modeling nested data relationships with MongoDB and Mongoose.
- **Frontend Interaction:** Asynchronous API communication using the `fetch` API.
- **Containerization:** Ready-to-use Docker environment for easy deployment.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Frontend** | HTML5, JavaScript (ES6+), Tailwind CSS |
| **Security** | JWT, bcryptjs |
| **DevOps** | Docker, Docker Compose |

## ✨ Key Features

- **User Authentication:** Secure registration and login functionalities.
- **Dynamic Dashboard:** Authorized users can perform Create, Read, Update, and Delete (CRUD) operations on their personal "Persons" list.
- **Admin Panel:** Special administrative access to monitor system statistics, overall users, and global data entries.
- **Responsive UI:** Modern, mobile-friendly interface styled with glassmorphism aesthetics.
- **Automated Seeding:** Automatic creation of an initial Administrative account upon server startup.

## 📂 Project Architecture

```text
├── server.js           # Server entry point & DB configuration
├── models/             # Mongoose schemas (User, Person)
├── routes/             # API endpoint definitions (Auth, Admin, Persons)
├── middleware/         # Custom authentication & role-check middleware
├── public/             # Static frontend assets (HTML, JS, CSS)
└── Dockerfile          # Container build instructions
```

## ⚙️ How to Run

### Method 1: Local Setup (Recommended for Development)
1. Ensure **MongoDB** is running locally (`mongodb://localhost:27017`).
2. Install dependencies: `npm install`.
3. Start the server: `node server.js`.
4. Access via: `http://localhost:5000`.

### Method 2: Docker Environment
1. Ensure Docker Desktop is running.
2. Build and start containers: `docker-compose up --build`.
3. Access via: `http://localhost:5000`.

## 🛡️ Default Admin Credentials (Auto-Generated)
- **Email:** `akeabde@gmail.com`
- **Password:** `71067106`

---

*This project was created for educational purposes, focusing on clean code architecture and developer-friendly documentation.*
