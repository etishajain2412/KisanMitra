const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB=require('./config/db')
const User = require('./models/User');  // Import the User model
const authRoutes=require('./routes/auth')
const profile=require('./routes/profile')
const polygonRoutes=require('./routes/polygonRoutes')
const weatherRoutes=require('./routes/weatherRoutes')
const productRoutes=require('./routes/product')
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // ✅ Allows all origins
app.options("*", (req, res) => {  // ✅ Allow all preflight requests
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
   
 }); // ✅ Respond with 204 No Content
 const port = process.env.PORT || 5000;
 
 require('dotenv').config();
connectDB();
// Middleware
app.use(cors());
app.use(express.json());

// Example route

app.use('/api/auth', authRoutes);
app.use('/api/users',profile );
app.use('/api/products',productRoutes );



// Use Routes
app.use("/api/polygon", polygonRoutes);
 app.use("/api/weather", weatherRoutes);
 console.log("✅ Routes Registered.");


 app._router.stack.forEach((r) => {
   if (r.route && r.route.path) {
       console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
   }
 });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
