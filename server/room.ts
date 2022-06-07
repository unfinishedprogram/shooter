import { WebSocket, WebSocketServer } from "ws";
import { constructMessage, decodeMessage, encodeMessage, IMessageTypes, Message, MessageDataType, MessageType } from "../shared/message";
import createMessageListenerBuffer from "../shared/messageListenerBuffer";

export default class Room {
	clients:Set<WebSocket> = new Set();
	listeners = createMessageListenerBuffer();

	constructor(server:WebSocketServer) {
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
		this.listeners[message.meta.messageType].forEach(cb => cb(socket, message.data))
	}

	public on<T extends MessageType>(messageType:T, callback:(socket:WebSocket, data:MessageDataType<T>) => void) {
		this.listeners[messageType].add(callback);
	}
	
	public removeListener<T extends MessageType>(messageType:T, callback:(socket:WebSocket, data:MessageDataType<T>) => void) {
		this.listeners[messageType].delete(callback);
	}

	public broadcastMessage(message:Message<MessageType>) {
		this.clients.forEach(c => this.sendMessage(c, message));
	}
}