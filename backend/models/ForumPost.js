const mongoose = require("mongoose");

const ForumPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    question: { type: String, required: true },
    answers: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            userName: String,
            answer: String,
            createdAt: { type: Date, default: Date.now },
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ForumPost", ForumPostSchema);
