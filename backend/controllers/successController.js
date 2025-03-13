const mongoose = require("mongoose");
const SuccessStory = require("../models/SuccessStory");
// ✅ Add a new success story
exports.addStory = async (req, res) => {
    try {
        console.log("📩 Received Story Data:", req.body);

        const {title,  description, imageUrl, farmerName } = req.body;
        // const farmerName = req.user?.name || "Anonymous"; // ✅ Extract farmer's name from auth token
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const newStory = new SuccessStory({
            title,
            description,
            imageUrl: imageUrl || "", // ✅ Optional image URL
            farmerName: farmerName || "Anonymous",
        });

        await newStory.save();
        console.log("saved new story");
        res.status(201).json({ message: "Success story added!", story: newStory });
        // ✅ Broadcast the new story to all users via Socket.io
        // Get socket instance
        io.emit("newStory", newStory);
    } catch (error) {
        res.status(500).json({ message: "Error adding story", error });
    }
};

// ✅ Fetch all success stories
exports.getStories = async (req, res) => {
    try {
        const stories = await SuccessStory.find().populate("comments.user", "name").sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stories", error });
    }
};

// ✅ Like a story
exports.likeStory = async (req, res) => {
    console.log("Received body:", req.body); // ✅ Debugging log
    try {
        console.log("request at like controller:", JSON.stringify(req.body,null,2))
        const { userId } = req.body;
        console.log("✅ Extracted userId:", userId);
        const { storyId } = req.params;
         // Check if userId is defined
         if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const story = await SuccessStory.findById(storyId);
        if (!story) return res.status(404).json({ message: "Story not found" });
         // ✅ Check if user has already liked the story
         console.log("story found:", story);
         console.log("story.likedBy before:", story.likedBy);
 
         const alreadyLiked = story.likedBy.some(id => id.toString() === userId);

         console.log("alreadyLiked:", alreadyLiked);

         if (alreadyLiked) {
             // ✅ Unlike: Remove user from likedBy array
             story.likedBy = story.likedBy.filter(id => id.toString() !== userId);
             story.likes = Math.max(0, story.likes - 1);
         } else {
             // ✅ Like: Add user to likedBy array
             story.likedBy.push(userId);
             story.likes += 1;
         }
        await story.save();
        console.log("likes saved in db")
        const updatedStory = await SuccessStory.findById(storyId);
console.log("updated story:", updatedStory.likedBy);

        io.emit("storyLiked", { storyId, likes: story.likes })
        res.json({ success: true, likes: story.likes, isLiked: !alreadyLiked});

    } catch (error) {
        console.error("❌ Error toggling like:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Add a comment to a story
exports.addComment = async (req, res) => {
    try {
        const { userId, userName, text } = req.body;
        const { storyId } = req.params;

        console.log("🔹 Request Body:", req.body);

        const story = await SuccessStory.findById(storyId);
        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found" }); // ✅ RETURN to prevent further execution
        }

        const newComment = {
            user: new mongoose.Types.ObjectId(userId), 
            userName, 
            text, 
            createdAt: new Date()
        };

        story.comments.push(newComment);

        await story.save();

        console.log("✅ Comment Added Successfully");

        return res.status(201).json({ success: true, message: "Comment added", comment: newComment });

    } catch (error) {
        console.error("❌ Error Adding Comment:", error);

        if (!res.headersSent) { // ✅ Ensure only one response is sent
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }
};
