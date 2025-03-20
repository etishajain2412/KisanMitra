const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const i18n = require("i18n");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

// Initialize Express and Server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// ✅ Store io instance in `global` so it can be used anywhere
global.io = io;

// ✅ Initialize Database Connection
connectDB();

// ✅ Initialize Sockets
const { initializeSockets } = require("./sockets/socketManager");
initializeSockets(io);

// ✅ i18n Configuration (Multi-Language Support)
i18n.configure({
  locales: ["en", "hi", "bn", "pa", "gu"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  queryParameter: "lang",
  header: "accept-Language",
});

app.use(i18n.init);

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const polygonRoutes = require("./routes/polygonRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const productRoutes = require("./routes/product");
const paymentRoutes = require("./routes/paymentRoutes");
const forumRoutes = require("./routes/ForumRoutes");
const videoRoutes = require("./routes/videoRoutes");
const successRoutes = require("./routes/successRoutes");
const newsRoutes = require("./routes/news")(io); // ✅ Pass io to news routes

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/polygon", polygonRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/success-stories", successRoutes);
app.use("/api/news", newsRoutes); // ✅ News route with Socket.io

console.log("✅ Routes Registered.");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Export App & Server for Testing
module.exports = { app, server };
