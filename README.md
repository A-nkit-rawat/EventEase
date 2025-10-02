# Event Booking API

A Node.js RESTful API for managing events, user registrations, bookings, and admin operations.

## Features

- User registration & authentication (JWT)
- Admin event management
- Event listing, filtering, and pagination
- Secure booking and cancellation
- Role-based access control

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication

## Setup

1. **Clone the repository**
   ```
   git clone https://github.com/your-repo-url.git
   cd backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment**
   - Create a `.env` file in `/backend`:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET_KEY=your_jwt_secret
     ```

4. **Start the server**
   ```
   npm start
   ```

## API Endpoints

- **Auth:** `/login`, `/register`, `/logout`
- **User:** `/events`, `/events/:eventId`, `/book/:eventId`, `/cancel/:bookingId`
- **Admin:** `/admin/events`, `/admin/users`, etc.

## Folder Structure

- `controllers/` – Route logic
- `models/` – Mongoose schemas
- `routes/` – API routes
- `middlewares/` – Auth & role checks
- `Helper/` – Utility functions
- `config/` – Swagger & config files

## Testing

- Use tools like Postman or Swagger (see `config/swagger.js`) for API testing.

---

**Contributions welcome!**