# Loom & Thread Local Business Website

A polished local business website for a boutique with:
- a modern landing page
- a booking form for stylist appointments
- a customer portal to view personal appointments
- an admin portal to view all customer bookings

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose

## Requirements
- Node.js (v18 or newer)
- MongoDB running locally or a MongoDB Atlas connection string
- npm

## Run locally
1. Install dependencies: npm install
2. Make sure MongoDB is running
3. Create a .env file with:
   - PORT=5000
   - MONGO_URI=mongodb://127.0.0.1:27017/loom-thread
4. Run the server: npm start
5. Open http://localhost:5000

## Admin login
Use your own secure admin credentials by updating the login logic in server.js before deploying.
