const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile);

        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        // Read state from cookies
        const isRegister = req.cookies.authState === 'register';
        console.log('Auth State from Cookie:', req.cookies.authState);

        if (isRegister) {
          // Registration Flow
          if (user) {
            // If user exists during registration, handle login
            console.log('User already exists, log in instead of registering');
            return done(null, false,{ message: 'User found. Please login' }); // Proceed with login flow
          } else {
            // If user doesn't exist, create a new user
            user = new User({
              name: profile.displayName,
              email,
              username: email.split('@')[0], // Default username from email
              password: null, // No password for Google auth
              provider: 'google',
            });

            await user.save();
            console.log('User registered successfully');
            return done(null, user);
          }
        } else {
          // Login Flow
          if (!user) {
            return done(null, false, { message: 'User not found. Please register first.' });
          }
          return done(null, user); // Proceed with login flow
        }
      } catch (err) {
        console.error('Error during Google authentication:', err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
