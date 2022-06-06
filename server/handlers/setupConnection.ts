import WebSocket, { WebSocketServer } from "ws";
import onMessage from "./onMessage";

import { constructMessage, decodeMessage, encodeMessage } from "../../shared/message";

const setupConnection = (socket: WebSocket) => {
	socket.on("message", (msg) => onMessage(decodeMessage(msg)));
	console.log("connection established");
	socket.send(encodeMessage(constructMessage("Hello")))
}

export default setupConnection;