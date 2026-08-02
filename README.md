# Smart Digital Approval Portal (SDAP)

A modern, paperless workflow application for educational institutions to digitize student approval letters.

## Features
- **Role-Based Access Control:** Distinct workflows for Students, Mentors, HODs, Principals, and Admins.
- **JWT Authentication:** Secure API access.
- **Dynamic Workflows:** Requests transition automatically based on role approvals.
- **Premium UI/UX:** Built with React 19, Tailwind CSS v4, Lucide React, and Framer Motion.
- **Clean Architecture:** Spring Boot backend following SOLID principles and layered design.

## Tech Stack
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA, PostgreSQL, MapStruct, Lombok.
- **Frontend:** React 19, Vite, Tailwind CSS v4, Zustand, Axios, React Hook Form, Framer Motion.

## Getting Started

### 1. Database Setup
A `docker-compose.yml` is provided in the root directory for local PostgreSQL development.
```bash
docker compose up -d
```
Alternatively, configure `spring.datasource.url` in `application.properties` to point to your Supabase instance.

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend runs on `http://localhost:8080`.
Upon the first startup, the database schema will be generated, and default users will be seeded.

**Default Users (Password: `Password@123` for all):**
- `student@college.edu`
- `mentor@college.edu`
- `hod@college.edu`
- `principal@college.edu`
- `admin@college.edu`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

## Architecture Note
The backend separates Entities from DTOs and maps them using MapStruct. 
Controllers and Services strictly use DTOs to communicate with the frontend.
