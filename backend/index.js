const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require("http");
const socketIo = require("socket.io");
const i18n = require("i18n");
const connectDB=require('./config/db')
//const User = require('../models/User');  // Import the User model
const authRoutes=require('./routes/auth')
const profile=require('./routes/profile')
const polygonRoutes=require('./routes/polygonRoutes')
const weatherRoutes=require('./routes/weatherRoutes')
const productRoutes=require('./routes/product')
const paymentRoutes = require('./routes/paymentRoutes');
const forumRoutes = require("./routes/ForumRoutes");
const videoRoutes = require("./routes/videoRoutes");
const { initializeSockets } = require("./sockets/socketManager")
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "http://localhost:3000" },  // Allow frontend connection
});

// ✅ Store io instance in `global` so it can be used anywhere
global.io = io;

i18n.configure({
  locales: ["en", "hi", "bn", "pa", "gu"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  queryParameter: "lang",
  header: "accept-Language" // Allows `?lang=hi` in API requests
});
app.use(i18n.init);


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
app.use(cors({
  origin: "http://localhost:3000", // ✅ Frontend URL
   
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Ensure form data is parsed


// Example route

app.use('/api/auth', authRoutes);
app.use('/api/users',profile );
app.use('/api/products',productRoutes );



// Use Routes
app.use("/api/polygon", polygonRoutes);
 app.use("/api/weather", weatherRoutes);
 app.use('/api/payment', paymentRoutes);
 app.use("/api/forum", forumRoutes);
 app.use("/api/videos", videoRoutes);
 console.log("✅ Routes Registered.");


 app._router.stack.forEach((r) => {
   if (r.route && r.route.path) {
       console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
   }
 });
 initializeSockets(io);
 module.exports = { app, server };
server.listen(port, () => {
  console.log(`🚀Server running on port ${port}`);
})
