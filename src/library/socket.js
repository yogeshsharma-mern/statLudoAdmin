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
// import { io } from "socket.io-client";

// const socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
//   autoConnect: false,
//   path:"/socket.io" // don't auto connect
// });

// export default socket;



// utils/socket.js
// import { io } from "socket.io-client";

// let socket = null;

// export const connectSocket = (adminId) => {
//   if (!socket) {
//     socket = io("http://localhost:5000", {
//       query: { adminId }, // id bhejne ke liye
//       transports: ["websocket"],
//     });
//   }
//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };


// import { io } from "socket.io-client";

// let socket = null;

// export const connectSocket = () => {
//   if (!socket) {
//     console.log("Connecting socket...");

//     socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL, {
//       transports: ["websocket"],
//       path: "/socket.io",
//     });

//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });
//   }
//   return socket;
// };




// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     console.log("Disconnecting socket:", socket.id);
//     socket.disconnect();
//     socket = null;
//   }
// };
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (adminId) => {
  if (!socket) {
    console.log("🔌 Creating new socket connection...");

    socket = io(process.env.NEXT_PUBLIC_API_SOCKET_URL, {
      transports: ["websocket"],
      path: "/socket.io",
      auth: { adminId }, // ✅ server ko ID bhejna
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      if (adminId) {
        socket.emit("register_user", adminId); // ✅ ensure always registered
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
  } else {
    console.log("♻️ Reusing existing socket:", socket.id);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket:", socket.id);
    socket.disconnect();
    socket = null;
  }
};
