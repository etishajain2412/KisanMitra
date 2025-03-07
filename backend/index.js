const express = require('express');
const cors = require('cors');
const connectDB=require('./config/db')
require('dotenv').config();
const User = require('./models/user');  // Import the User model
const authRoutes=require('./routes/auth')
const profile=require('./routes/profile')
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // ✅ Allows all origins
app.options("*", (req, res) => {  // ✅ Allow all preflight requests
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);  // ✅ Respond with 204 No Content
const port = process.env.PORT || 5000;

connectDB();
// Middleware
app.use(cors());
app.use(express.json());

// Example route

app.use('/api/auth', authRoutes);
app.use('/api/users',profile );



// Use Routes
app.use("/api/polygon", polygonRoutes);
 app.use("/api/weather", weatherRoutes);
 console.log("✅ Routes Registered.");


 app._router.stack.forEach((r) => {
   if (r.route && r.route.path) {
       console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
   }
 });
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
