const setupForumSocket = (io, socket) => {
    socket.on("newMessage", (messageData) => {
        console.log("📩 New Message Received:", messageData);
        io.emit("messageBroadcast", messageData); // Broadcast to all clients
    });

    socket.on("newAnswer", (answerData) => {
        console.log("📩 New Answer Received:", answerData);
        io.emit("answerBroadcast", answerData); // ✅ Broadcast the answer update
    });
};

module.exports = { setupForumSocket };
