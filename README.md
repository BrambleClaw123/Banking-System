<h1 align="center">🏦 Node.js Banking System API</h1>

<p align="center">

  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">

  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">

  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">

  <img src="https://img.shields.io/badge/JWT-Security-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">

  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black" alt="Swagger">

</p>



<p align="center">

  <i>A robust, secure, and scalable backend RESTful API for a banking system built to master Node.js, Express.js, and modern backend architectures.</i>

</p>

---

## 📝 Overview

**Banking System API** is a comprehensive backend application designed to simulate core banking operations. Developed using **Node.js** and **Express.js**, the system provides secure user authentication, account management, and transactional capabilities (deposits, transfers). 

This project was built from the ground up as a learning journey into Node.js ecosystem, demonstrating a solid understanding of the **3-Layer Architecture (Controller-Service-Repository)**, relational database management using **Prisma ORM**, automated testing, and secure API design practices.

## ✨ Key Features

### 🛡️ Security & Authorization
* **JWT Authentication:** Secure login and registration with encrypted passwords (using `bcrypt`) and token-based session management.
* **API Protection:** Custom authentication middleware to protect sensitive routes and `rateLimit` middleware to prevent brute-force or DDoS attacks.
* **Input Validation:** Strict data validation middleware ensuring payload integrity before processing requests.

### 💰 Core Banking Operations
* **Account Management:** Securely retrieve account balances and account details.
* **Transactions:** Robust logic for depositing money and transferring funds between accounts (including constraints like preventing self-transfers or negative amounts).
* **Email Notifications:** Automated email alerts triggered upon successful transactions (e.g., successful transfers).

### 📖 API Documentation & Testing
* **Swagger UI Integration:** Fully documented API endpoints for seamless frontend integration and testing.
* **Unit Testing:** Comprehensive test suites for core services (User Service, Account Service) handling edge cases.

---

## 🛠️ Tech Stack & Architecture

### 🧠 Technical Highlights
* **Architecture:** Strictly adheres to the **3-Layer Architecture** (Controller, Service, Repository) ensuring clean separation of concerns, scalability, and maintainability.
* **Database ORM:** Utilized **Prisma** for type-safe database querying, schema modeling, and seamless migrations.
* **Error Handling:** Centralized asynchronous error handling using custom wrappers (`catchAsync`) and error middleware.

### Backend Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database Access:** Prisma ORM
* **Security:** JSON Web Token (JWT), bcrypt
* **Documentation:** Swagger (OpenAPI)
* **Testing:** Automated testing framework (Vitest)

---

## 📂 Project Structure

```text
banking-system/
├── config/             # Database and application configurations (Prisma client)
├── controllers/        # Request handlers (User, Account) routing data to services
├── docs/               # Swagger OpenAPI specifications (YAML)
├── middlewares/        # Custom middlewares (auth, error handling, rate limiting, validation)
├── prisma/             # Prisma schema and database migrations
├── repositories/       # Data Access Layer interacting directly with the database
├── routes/             # Express route definitions (API endpoints)
├── services/           # Core business logic (Transactions, Email sending, Auth)
├── tests/              # Unit tests for services (e.g., account.service.test.js)
├── utils/              # Helper utilities (catchAsync, emailTemplate, swagger config)
└── validations/        # Input validation schemas
```

## 🚀 Setup & Installation

### Prerequisites
* **Node.js:** v16 or higher
* **npm:** Node Package Manager
* **Database:** Relational Database supported by Prisma (MySQL)

### Installation Steps

**1. Clone the repository:**
```bash
git clone https://github.com/BrambleClaw123/Banking-System.git
cd banking-system
```

**2. Install Dependencies:**
```bash
npm install
```

**3. Configure the Environment:**
* Create a `.env` file in the root directory.
* Add your database connection string and JWT secret:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_name
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DATABASE_URL="mysql://your_db_name:your_db_password@localhost:3306/your_db_name"
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_provided_by_google

```

**4. Initialize the Database:**
Apply Prisma migrations to create the required tables in your database.
```bash
npx prisma migrate dev
```

**5. Run the Application:**
* **Development mode:**
```bash
npm run dev
```
* **Production mode:**
```bash
npm start
```

**6. Access the System:**
* **API Base URL:** `http://localhost:3000/api`
* **Swagger Documentation:** `http://localhost:3000/api-docs`

---

## 🧪 Testing

Run the automated test suites to ensure business logic integrity (e.g., transfer amount validations):

```bash
npm run test
```

---

## 👤 Author
**Huynh Pham Hoang Kha**
* **GitHub:** [@BrambleClaw](https://github.com/BrambleClaw123)
* **Email:** khahoang334455@gmail.com

> *If you found this learning project interesting or helpful, feel free to leave a ⭐!*
