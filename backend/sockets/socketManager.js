const { setupForumSocket } = require("./forumSocket");
const { setupVideoSocket } = require("./videoSockets");
const setupSuccessStoriesSocket = require("./successStoriesSocket");

const initializeSockets = (io) => {
    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        // ✅ Setup live forum discussions
        setupForumSocket(io, socket);

        // ✅ Setup real-time video updates
        setupVideoSocket(io, socket);

        setupSuccessStoriesSocket(io, socket); // ✅ Added success stories socket


        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });
};

module.exports = { initializeSockets };
