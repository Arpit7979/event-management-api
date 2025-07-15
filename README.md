# 🎉 Event Management API

A RESTful API for creating, managing, and registering users for events. Built with **Node.js**, **Express**, and **PostgreSQL**, it supports features like event creation, user registration, capacity control, and detailed stats.

---

## 📦 Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Arpit7979/event-management-api.git
cd event-management-api

```

### 2. Install dependencies

```bash
npm Install
```

### 3. Set up PostgreSQL

Make sure PostgreSQL is installed and running. Create a database:

```bash
createdb eventdb
```

### 4. Configure environment variables

Create a .env file in the root:

```bash
DB_USER=postgres
DB_HOST=localhost
DB_NAME=eventdb
DB_PASS=yourpassword
DB_PORT=5432
PORT=3000
```

### 5. Create Tables

you can create table using this cammand or you can directly create using postgres with the code in schema.sql

```bash
psql -U postgres -d eventdb -f schema.sql
```

### 6. Start the server

```bash
node index.js
```
