import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://fidelbridge-backend.onrender.com" // your deployed backend URL
    : "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // prefer websocket
  withCredentials: true,
});

export default socket;
