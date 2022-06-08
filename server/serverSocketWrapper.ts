import { WebSocket, WebSocketServer } from "ws";
import { constructMessage, decodeMessage, encodeMessage, Message, MessageDataType, MessageType } from "../shared/message";
import MessageSubject from "../shared/messageSubject";
import { v4 as uuidv4 } from 'uuid';

export default class ServerSocketWrapper extends MessageSubject {
	clients:Set<WebSocket> = new Set();

	private clientsIdMap : {
		[index:string]:WebSocket;
	} = {};

	constructor(server:WebSocketServer) {
		super();
		server.on("connection", socket => this.addClient(socket));
		server.on("close", () => this.clients.clear());
	}

	private sendMessage(client:WebSocket, message:Message<MessageType>) {
		client.send(encodeMessage(message));
	}

	private addClient(socket:WebSocket) {
		this.handleClientIdAssign(socket)
			.then(() => {
				console.log(Object.keys(this.clientsIdMap));
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
		
			}
		) 
	}

	private genId():string {
		return uuidv4();
	}

	private handleClientIdAssign(socket:WebSocket):Promise<boolean> {
		return new Promise((res, rej) => {
			socket.once("message", (data) => {
				const resObj = JSON.parse(`${data}`) as Message<"requestId">;
				if(resObj.meta.messageType == "requestId") {
					const id = this.genId();
					this.sendMessage(socket, constructMessage("supplyId", id))
					this.clientsIdMap[id] = socket;
					res(true)
				} else if (resObj.meta.messageType == "supplyId") {
					const id = resObj.data;
					this.clientsIdMap[id] = socket;
					res(true)
				}
			}) 
		})
	}

	private receiveMessage(socket:WebSocket, message:Message<MessageType>) {
		this.updateListeners(message, (message => this.sendMessage(socket, message)));
	}

	public broadcastMessage(message:Message<MessageType>) {
		this.clients.forEach(c => this.sendMessage(c, message));
	}
}