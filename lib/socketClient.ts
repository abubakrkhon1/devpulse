import { io as ClientIO } from "socket.io-client";

let socket: ReturnType<typeof ClientIO>|null = null;

export function getEmitSocket() {
  if (!socket) {
    socket = ClientIO("http://localhost:3001");
  }
  return socket;
}