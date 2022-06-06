import { WebSocketServer } from "ws";
import onMessage from "./onMessage";

import { decodeMessage } from "../../shared/message";

const setupConnection = (socket: WebSocketServer) => {
	socket.on("message", (msg) => onMessage(decodeMessage(msg)));
	console.log("connection established");
}

export default setupConnection;