# Commerce AI 🛍️

A modern, full-stack e-commerce platform built with **Spring Boot** and **React**. This application features a secure, JWT-authenticated backend, seamless Cloudinary image integration, and a highly polished, responsive Tailwind CSS frontend.

## ✨ Key Features

* **Secure Authentication:** JWT-based login and protected routes using Spring Security.
* **Product Catalog:** Browse, search (with debounced API calls), and view detailed product pages.
* **Shopping Cart:** Add/remove items, calculate dynamic totals, and mock checkout flows.
* **Media Management:** Direct image uploads to Cloudinary for product listings.
* **Modern UI/UX:** Built with Tailwind CSS, featuring glassmorphism, responsive split-screen layouts, and real-time toast notifications.

## 🛠️ Tech Stack

### Frontend
* **React 18** (Vite)
* **Tailwind CSS** (Styling & responsive design)
* **React Router DOM** (Navigation)
* **Axios** (API requests & interceptors)
* **Lucide React** (Iconography)
* **jwt-decode** (Client-side token parsing)
* **React Hot Toast** (Notifications)

### Backend
* **Java 17 & Spring Boot 3**
* **Spring Security** (JWT Authentication)
* **Spring Data JPA / Hibernate**
* **PostgreSQL / MySQL** (Relational Database)
* **Cloudinary SDK** (Image hosting)
* **Maven** (Dependency management)

---

## 🚀 Getting Started

### Prerequisites
* Java 17+
* Node.js 18+
* Maven
* A Cloudinary Account (Free tier)

### 1. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend

Create a .env file in the root of your backend project (same level as pom.xml):Code snippetCLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Update your application.properties or application.yml with your database credentials.
Run the application:Bashmvn spring-boot:run
The backend will run on http://localhost:8082. 

Frontend Setup (
React)Navigate to the frontend directory:Bash cd frontend
Install dependencies:Bash npm install
(Optional) Create a .env file to manage the API base URL:
VITE_API_BASE_URL=http://localhost:8080/api

Start the development server:Bash npm run dev
The frontend will run on http://localhost:5173🔒