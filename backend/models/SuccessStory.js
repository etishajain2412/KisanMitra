const mongoose = require("mongoose");
const User=require('./user');
const successStorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Optional image
    farmerName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Track users who liked
    comments: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true}, // ✅ Reference to User model
        userName: { type: String }, 
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("SuccessStory", successStorySchema);
