const jwt = require('jsonwebtoken');
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');

  // Check if the header exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  // Check if the header is in the correct format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Access Denied: Invalid token format' });
  }

  // Extract the token
  const token = parts[1];

  // Verify the token
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    console.log("Decoded User:", verified); // Debugging (remove in production)

    // Attach the user ID to the request object
    req.user = { id: verified.id }; // Ensure the payload contains `id`

    //  // ✅ Fetch user role from DB
    //  const user = await User.findById(req.user.userId);
    //  if (!user) {
    //      return res.status(404).json({ message: "User not found" });
    //  }

    //  req.user.role = user.role; // ✅ Attach user role

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Token verification error:', error.message); // Debugging
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;