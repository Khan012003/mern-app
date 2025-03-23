require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User');
const Course = require('./models/Course');
const path = require("path"); 
const corsOptions = {
  origin: "https://mern-freecodecamp-1-o384.onrender.com",
  credentials: true, 
};
const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));
// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL,'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Authentication routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json({
      user,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      user,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, googleId });
    }

    res.json({
      user,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

// Course routes
app.get('/api/courses', async (req, res) => {
  try {
    res.json(await Course.find());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));