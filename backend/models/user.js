const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
   // ✅ Add role field with default as "farmer"
   role: {
    type: String,
    enum: ["farmer", "admin"], // ✅ Only "farmer" or "admin" allowed
    default: "farmer", // ✅ Default is "farmer"
},
  profilePicture: {
    type: String,  
    default: null  
  }
  
}, { timestamps: true });  

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
