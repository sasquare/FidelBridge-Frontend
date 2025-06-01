import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://fidelbridge-backend.onrender.com"
    : "http://localhost:5000");

const socket = io(SOCKET_URL, {
  withCredentials: true,
  path: "/socket.io",
  // transports: ["polling", "websocket"], // optional fallback is automatic
});

// Debugging listeners
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket disconnected:", reason);
});

export default socket;
