const Video = require("../models/Video");

const setupVideoSocket = (io, socket) => {
    // ✅ Listen for video updates (views/reviews)
    socket.on("videoUpdated", async (videoId) => {
        try {
            const video = await Video.findById(videoId);
            if (!video) return;

            io.emit("videoUpdated", video); // ✅ Broadcast updated video data
        } catch (error) {
            console.error("❌ Error in video update socket:", error);
        }
    });
};

module.exports = { setupVideoSocket };
