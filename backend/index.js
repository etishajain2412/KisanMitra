const express = require('express');
const cors = require('cors');
const connectDB=require('./config/db')
require('dotenv').config();
const User = require('./models/user');  // Import the User model
const authRoutes=require('./routes/auth')
const app = express();
const port = process.env.PORT || 5000;

connectDB();
// Middleware
app.use(cors());
app.use(express.json());
// Example route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
