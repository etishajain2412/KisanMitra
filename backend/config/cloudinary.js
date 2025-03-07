// config/cloudinary.js
require('dotenv').config(); // Load environment variables

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Use Cloudinary cloud name from .env
  api_key: process.env.CLOUDINARY_API_KEY,       // Use API key from .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Use API secret from .env
  timeout: 240000,
});

module.exports = cloudinary;