import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";  // ✅ Backend Socket.io Server
export const socket = io(SOCKET_URL, { transports: ["websocket"] });

socket.on("connect", () => {
    console.log("🔌 Connected to WebSocket Server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket Server");
});

export default socket;
