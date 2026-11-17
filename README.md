# Psychologists.Services: Backend
REST API for a service that helps people find and book psychologists.It provides user registration and authentication, a public list of psychologists with filtering and pagination, a private "Favorites" list for each user, and a public appointment request form.

## Features
- User registration, login, logout, and session refresh
- Cookie-based sessions with short-lived access tokens and long-lived refresh tokens
- Public psychologists list with filters and pagination (3 items per page)
- Private favorites: add, remove, and list favorite psychologists
- `isFavorite` flag on psychologists for authenticated users
- Appointment requests that anyone can submit, with or without an account
- Request validation with `celebrate` / Joi
- Centralized error handling

## Tech Stack
- Node.js (ES Modules), Express
- Firebase Realtime Database via Firebase Admin SDK
- bcrypt for password hashing
- cookie-parser, cors
- celebrate (Joi) for validation
- http-errors for error handling
- ESLint, Prettier, nodemon

## Getting Started
### Prerequisites
- Node.js 18+
- A Firebase project with Realtime Database enabled and a service account key

### Installation
```bash
git clone https://github.com/YuliyaZakrepa/psychologists.git
cd psychologists
npm install
```

### Firebase Realtime Database rules
```json
{
  "rules": {
    "psychologists": { ".read": true, ".write": false },
    "users": { ".read": false, ".write": false, ".indexOn": ["email"] },
    "sessions": { ".read": false, ".write": false, ".indexOn": ["userId"] },
    "appointments": { ".read": false, ".write": false, ".indexOn": ["psychologistId"] }
  }
}
```

### Run
```bash
npm run dev   # development with nodemon
npm start     # production
```

## API Reference
Successful responses use the format `{ "status": <code>, "data": ... }`. Paginated endpoints also return a `pagination` object.

### Auth
| Method | Endpoint         | Description         | Access  |
| ------ | ---------------- | ------------------- | ------- |
| POST   | `/auth/register` | Register a new user | Public  |
| POST   | `/auth/login`    | Log in              | Public  |
| POST   | `/auth/refresh`  | Refresh the session | Cookies |
| POST   | `/auth/logout`   | Log out             | Cookies |

### Psychologists
| Method | Endpoint             | Description                    | Access                                   |
| ------ | -------------------- | ------------------------------ | ---------------------------------------- |
| GET    | `/psychologists`     | List psychologists (paginated) | Public (`isFavorite` set when logged in) |
| GET    | `/psychologists/:id` | Get one psychologist           | Public (`isFavorite` set when logged in) |

Query parameters for the list:
| Parameter | Description                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `page`    | Page number, default `1`                                                                              |
| `filter`  | `show_all` (default), `a_to_z`, `z_to_a`, `less_than_10`, `greater_than_10`, `popular`, `not_popular` |

### Favorites (authenticated only)
| Method | Endpoint                     | Description                                |
| ------ | ---------------------------- | ------------------------------------------ |
| GET    | `/favorites`                 | List favorites (supports `page`, `filter`) |
| POST   | `/favorites/:psychologistId` | Add a psychologist to favorites            |
| DELETE | `/favorites/:psychologistId` | Remove a psychologist from favorites       |

### Appointments (public)
| Method | Endpoint        | Description                                   | Access |
| ------ | --------------- | --------------------------------------------- | ------ |
| POST   | `/appointments` | Send an appointment request to a psychologist | Public |

Request body:
| Field            | Type   | Rules                                     |
| ---------------- | ------ | ----------------------------------------- |
| `psychologistId` | string | Required, must exist in the database      |
| `name`           | string | Required, 2 to 50 characters              |
| `phone`          | string | Required, format `+380XXXXXXXXX`          |
| `time`           | string | Required, `HH:00` or `HH:30`, e.g. `09:30` |
| `email`          | string | Required, valid email                     |
| `comment`        | string | Optional, up to 500 characters            |

Example request:
```json
{
  "psychologistId": "-Opsy111",
  "name": "Yuka",
  "phone": "+380501234567",
  "time": "09:30",
  "email": "test@mail.com",
  "comment": "First consultation"
}
```

Example response (`201 Created`):
```json
{
  "status": 201,
  "message": "Appointment created",
  "data": {
    "id": "-Oapp123",
    "psychologistId": "-Opsy111",
    "name": "Yuka",
    "phone": "+380501234567",
    "time": "09:30",
    "email": "test@mail.com",
    "comment": "First consultation",
    "createdAt": 1763400000000
  }
}
```
Errors: `400` for invalid body, `404` if the psychologist does not exist.

### Example list response
```json
{
  "status": 200,
  "data": [
    { "id": "-Opsy111", "name": "Dr. Sarah Davis", "rating": 4.75, "isFavorite": true }
  ],
  "pagination": {
    "page": 1,
    "perPage": 3,
    "totalItems": 9,
    "totalPages": 3,
    "hasNextPage": true
  }
}
```

## Authentication
On register, login, and refresh, the server sets three `httpOnly` cookies: `sessionId`, `accessToken`, and `refreshToken`. The access token lives for 15 minutes and the refresh token for 30 days. Clients must send requests with credentials (`withCredentials: true` for axios, `credentials: 'include'` for fetch).

## Data Model
```
users/<userId>
  name, email, password (hash), createdAt
  favorites/<psychologistId>: true
psychologists/<psychologistId>
  name, rating, price_per_hour, ...
sessions/<sessionId>
  userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil
appointments/<appointmentId>
  psychologistId, name, phone, time, email, comment, createdAt
```

## Project Structure
```
src/
  controllers/   request handlers
  db/            Firebase connection
  middleware/    authenticate, error handling, logging, 404
  routes/        auth, psychologists, favorites, appointments
  services/      session logic
  utils/         filters and pagination
  validations/   celebrate schemas
  server.js
```

## Links
- Frontend: `<link>`
- Deployed API: `<link>`
- Design: `<Figma link>`

## Author
[Yuliya Zakrepa](https://github.com/YuliyaZakrepa)
