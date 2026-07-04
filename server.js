const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'customer' }
});

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'customer' });

    res.json({ message: 'User created', user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === 'MUHAMMEDASHIF' && password === 'Ashif@0112') {
      return res.json({ message: 'Login successful', user: { name: 'Admin', email: 'MUHAMMEDASHIF', role: 'admin' } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { email, role } = req.query;
    if (role === 'admin') {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json(bookings);
    }

    if (email) {
      const bookings = await Booking.find({ email }).sort({ createdAt: -1 });
      return res.json(bookings);
    }

    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
