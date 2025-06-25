const mongoose = require("mongoose");
const User=require('./user');
const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }, // ✅ Cloudinary URL
    category: { type: String, enum: ["Tutorial", "Webinar"], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Farmer who uploaded
    views: { type: Number, default: 0 },
    // reviews: { type: Number, default: 0 },
    reviews: {
        type: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Reference User model
                text: { type: String, required: true }, // ✅ Ensure text is always provided
                createdAt: { type: Date, default: Date.now },
            }
        ],
        default: [], // ✅ Ensures an empty array if no reviews exist
    },
    earnings: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", VideoSchema);
