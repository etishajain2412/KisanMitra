const SuccessStory  = require("../models/SuccessStory");
const User  = require("../models/user");
module.exports = (io, socket) => {
    console.log("📡 Success Stories Socket Connected:", socket.id);

    // ✅ Handle real-time likes
    socket.on("likeStory", async ({ storyId, userId }) => {
        try {
            console.log(`🔹 User ${userId} is liking/unliking story ${storyId}`);
            if (!userId || !storyId) return;

            const SuccessStory = require("../models/SuccessStory");
            const story = await SuccessStory.findById(storyId);
            if (!story) return;

            const alreadyLiked = story.likedBy.includes(userId);

            if (alreadyLiked) {
                // User already liked the story → Unlike it
                story.likedBy = story.likedBy.filter(id => id.toString() !== userId);
                story.likes = Math.max(0, story.likes - 1);
            } else {
                // User hasn't liked → Like it
                story.likedBy.push(userId);
                story.likes += 1;
            }

            await story.save();

            console.log(`🔹 Story ${storyId} now has ${story.likes} likes.`);

            // Broadcast updated likes to all users
            io.emit("storyLiked", { storyId, likes: story.likes, isLiked: !alreadyLiked });

        } catch (error) {
            console.error("❌ Error toggling like:", error);
        }
    });

        // ✅ Listen for new success story submissions
    socket.on("newStory", async ({ title, description, imageUrl, farmerName }) => {
        try {
            const SuccessStory = require("../models/SuccessStory");

            // ✅ Save the new story in the database
            const newStory = new SuccessStory({
                title,
                description,
                imageUrl: imageUrl || "",
                farmerName
            });

            await newStory.save();

            // ✅ Broadcast new story to all connected clients
            io.emit("newStoryAdded", newStory);
            console.log("📢 New story broadcasted:", newStory);
        } catch (error) {
            console.error("❌ Error adding new story:", error);
        }
    });

    // ✅ Handle real-time comments
    socket.on("commentStory", async ({ storyId, comment }) => {
        try {
            console.log("comment in socket" ,comment);
            // ✅ Fetch the full user details before broadcasting
            const user = await User.findById(comment.user).select("name");
            //    console.log(user)
            // if (!user) {
            //     console.warn("⚠️ User not found for comment!");
            //     return;
            // }
    
            // const commentWithUser = { ...comment, userName: user.name }; // ✅ Add user name
    
            // ✅ Broadcast the updated comment
            io.emit("storyCommented", { storyId, comment });
    
        } catch (error) {
            console.error("❌ Error handling comment broadcast:", error);
        }
    });
    

    socket.on("disconnect", () => {
        console.log("❌ Success Stories Socket Disconnected:", socket.id);
    });
};
