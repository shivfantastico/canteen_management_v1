import { io } from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_API_URL, {
  transports: ["websocket"],
//   10.0.2.2:5000
});

export default socket;