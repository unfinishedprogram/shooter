import { WebSocket, WebSocketServer } from "ws";
import { constructMessage, decodeMessage, encodeMessage, Message, MessageDataType, MessageType } from "../shared/message";
import MessageSubject from "../shared/messageSubject";
import { v4 as uuidv4 } from 'uuid';

export default class ServerSocketWrapper extends MessageSubject {
	clients:Set<WebSocket> = new Set();

	private clientIdMap : Map<WebSocket, string> = new Map();
	private idClientMap : Map<string, WebSocket> = new Map();

	constructor(server:WebSocketServer) {
		super();
		server.on("connection", socket => this.addClient(socket));
		server.on("close", () => this.clients.clear());
	}

	private sendMessage(clientId:string, message:Message<MessageType>) {
		const client = this.idClientMap.get(clientId);

		if(client) {
			this.sendMessageRaw(client, message);
		} else {
			console.error(`No client with id: ${clientId} , exists`);
		}
	}

	private sendMessageRaw(client:WebSocket, message:Message<MessageType>){
		client.send(encodeMessage(message));
	}

	private addClient(socket:WebSocket) {
		this.handleClientIdAssign(socket)
			.then(() => {
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

	private setClientId(client:WebSocket, id:string) {
		this.clientIdMap.set(client, id);
		this.idClientMap.set(id, client);
		this.clients.add(client);
	}

	private handleClientIdAssign(socket:WebSocket):Promise<boolean> {
		return new Promise((res, rej) => {
			socket.once("message", (data) => {
				const resObj = JSON.parse(`${data}`) as Message<"requestId">;
				let id = "";
				if(resObj.meta.messageType == "requestId") {
					id = this.genId();
					this.sendMessageRaw(socket, constructMessage("supplyId", id))
					this.setClientId(socket, id);
					res(true)
				} else if (resObj.meta.messageType == "supplyId") {
					id = resObj.data;
				}

				this.setClientId(socket, id);
				res(true);
			}) 
		})
	}

	private receiveMessage(socket:WebSocket, message:Message<MessageType>) {
		this.updateListeners(message, (message => this.sendMessageRaw(socket, message)));
	}

	public broadcastMessage(message:Message<MessageType>) {
		this.clients.forEach(c => this.sendMessageRaw(c, message));
	}
}