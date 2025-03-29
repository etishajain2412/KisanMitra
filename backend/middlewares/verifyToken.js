const jwt = require('jsonwebtoken');
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Check token in cookies first
    let token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];

    // 2️⃣ If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // 3️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decoded); // Debugging (remove in production)

    // 4️⃣ Attach user ID to request
    req.user = { id: decoded.id };

    // 5️⃣ (Optional) Fetch user role from DB if needed
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    // req.user.role = user.role;

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
