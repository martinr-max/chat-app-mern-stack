import  {createContext}  from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

export const socket = io.connect(SOCKET_URL);
const SocketContext = createContext(socket);

export default SocketContext;
