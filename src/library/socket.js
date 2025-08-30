// import { io } from "socket.io-client";
 
// const socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL, {
//     transports: ["websocket"], // force websocket
//     withCredentials: true,
//     autoConnect: false, // start as disconnected
// });
 
 
// // Listen for connection
// socket.on("connect", () => {
//     console.log("✅ Socket connected:", socket.id);
// });

//     // socket.on("new_payment", (data) => {
//     //   console.log("📩 New payment received:", data);
//     //   setPayments((prev) => [data, ...prev]); // 👈 prepend new payment
//     // });
 
// // Listen for disconnection
// socket.on("disconnect", (reason) => {
//     console.log("❌ Socket disconnected:", reason);
// });
 
// // Listen for errors
// socket.on("connect_error", (error) => {
//     console.error("⚠️ Socket connection error:", error.message);
// });
 
// // Explicitly connect
// socket.connect();
 
// export default socket;
// socket.js
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  path:"/socket.io" // don't auto connect
});

export default socket;




