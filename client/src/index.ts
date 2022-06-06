import { setupSocket } from "./socketHandling";

const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => setupSocket(socket);
