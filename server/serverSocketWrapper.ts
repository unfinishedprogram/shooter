import { WebSocket, WebSocketServer } from "ws";
import { constructMessage, decodeMessage, encodeMessage, IMessageTypes, Message, MessageDataType, MessageType } from "../shared/message";
import MessageSubject from "../shared/messageSubject";

export default class ServerSocketWrapper extends MessageSubject{
	clients:Set<WebSocket> = new Set();

	constructor(server:WebSocketServer) {
		super();
		server.on("connection", socket => this.addClient(socket));
		server.on("close", () => this.clients.clear());
	}

	private sendMessage(client:WebSocket, message:Message<MessageType>) {
		client.send(encodeMessage(message));
	}

	private addClient(socket:WebSocket) {
		this.clients.add(socket);
		
		socket.on("close", () => {
			this.clients.delete(socket);
		})

		socket.on("error", err => {
			this.clients.delete(socket);
			console.error(err);
		})

		socket.on("message", (msg) => {
			this.receiveMessage(socket, decodeMessage(msg));
		})

		this.broadcastMessage(constructMessage("ping", "Hello Clients!"))
	}

	private receiveMessage(socket:WebSocket, message:Message<MessageType>) {
		this.updateListeners(socket, message);
	}

	public broadcastMessage(message:Message<MessageType>) {
		this.clients.forEach(c => this.sendMessage(c, message));
	}
}