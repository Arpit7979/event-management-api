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

## API Endpoints & Examples

### `POST /register` – Register a new user

Registers a user with name and email.

#### Request Body:

```json
{
  "name": "Arpit",
  "email": "arpit@gmail.com"
}
```

#### Response

```json
{
  "userId": "userId"
}
```

### POST /create-event – Create a new event

Creates an event with a title, date_time, location, and capacity.

```json
{
  "title": "Meeting",
  "datetime": "2025-08-15T10:00:00Z",
  "location": "Delhi",
  "capacity": 500
}
```

#### Response

```json
{
  "eventId": "eventId of the created event"
}
```

### GET /:id – Get event details

Returns full event info + all registered users.

```json
{
  "id": 10,
  "title": "Tech Conference",
  "date_time": "2025-07-30T04:30:00.000Z",
  "location": "Delhi",
  "capacity": 2,
  "created_at": "2025-07-15T16:29:18.611Z",
  "registration": [
    {
      "id": 1,
      "name": "arpit",
      "email": "ark@gmail.com"
    }
  ]
}
```

### POST /:id/register – Register a user for an event

Registers a user for a specific event.

```json
{
  "userId": "userId"
}
```

#### Response

```json
{ "message": "registration successful" }
```

#### Error

```json
{ "error": "Already registered" }
{ "error": "Event is full" }
{ "error": "Cannot register for past event" }
```

### DELETE /:id/cancel-registration – Cancel a user's registration

Cancels a user's registration for an event.

#### Request body

```json
{
  "userId": "userId"
}
```

#### Response

```json
{
  "message": "Registration cancelled successfully"
}
```

#### error

```json
{
  "error": "No registration found"
}
```

### GET /upcoming-events – List upcoming events

Returns all future events, sorted by date (ascending) and then location.

```json
[
  {
    "id": 7,
    "title": "meetup",
    "date_time": "2025-07-16T10:42:15.573Z",
    "location": "buxar",
    "capacity": 1,
    "created_at": "2025-07-15T10:42:15.573Z"
  },
  {
    "id": 10,
    "title": "Tech Conference",
    "date_time": "2025-07-30T04:30:00.000Z",
    "location": "Delhi",
    "capacity": 2,
    "created_at": "2025-07-15T16:29:18.611Z"
  },
  {
    "id": 8,
    "title": "Tech Conference",
    "date_time": "2025-07-30T04:30:00.000Z",
    "location": "Delhi",
    "capacity": 500,
    "created_at": "2025-07-15T15:21:57.986Z"
  }
]
```

### GET /:id/event-status – Event statistics

Returns statistics about a specific event.

#### params {id: eventId} = 10;

```json
{
  "totalRegistrations": 1,
  "remainingCapacity": 1,
  "percentageUsed": "50.00%"
}
```
