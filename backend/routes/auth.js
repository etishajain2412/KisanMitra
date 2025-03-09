const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const router = express.Router();
const jwt=require('jsonwebtoken')

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Input validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
     console.log(res.data);
    // Send response with token
    res.status(200).json({
      message: 'Registration successful',
      token
    });
  } catch (error) {
    console.error('Error during registration:', error);
    
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', async (req, res) => {
    try {
      const { identifier, password } = req.body; // 'identifier' will be email or username
      
      // Check if the user exists by email or username
      const user = await User.findOne({
        $or: [
          { email: identifier },  // Match by email
          { username: identifier } // Match by username
        ]
      });
      
      // If user not found
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      
      // If password doesn't match
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      // Send response with token
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;

