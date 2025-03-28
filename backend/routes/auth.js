const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const passport = require("passport");
const router = express.Router();

// Register Route
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

    // Set token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    res.status(201).json({ message: 'Registration successful' });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // Can be email or username

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google Authentication Callback
router.get("/google/callback", (req, res, next) => {
    // Determine the failure redirect URL based on the authState cookie
    const failureRedirect = req.cookies.authState === "login"
        ? "http://localhost:3000/login?error=Please register first."
        : "http://localhost:3000/register?error=Please login first.";

    // Passport authentication middleware
    passport.authenticate("google", { session: false, failureRedirect })(req, res, next);
}, async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            // Redirect to login page with an error message when no user is found
            return res.redirect("http://localhost:3000/login?error=User not found. Please register first.");
        }

        // Generate JWT token for the user
        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set the token in a cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

      

        // Redirect to the profile page on successful login
        res.redirect("http://localhost:3000/profile");
    } catch (error) {
        console.error("Error during Google authentication:", error);
        // Redirect to login page with a server error message in case of exceptions
        res.redirect("http://localhost:3000/login?error=Server error during Google authentication. Please try again later.");
    }
});
// Logout Route
router.post('/logout', (req, res) => {
  req.logout(() => {  // Only works if Passport sessions are enabled
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


module.exports = router;
