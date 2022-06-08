import { constructMessage, decodeMessage, encodeMessage, Message, MessageType } from "../../shared/message";
import MessageSubject from "../../shared/messageSubject";

export default class ClientSocketWrapper extends MessageSubject {
	
	private id :string = "";
	
	public getId = () => this.id;

	public setId = (id:string) => {
		this.id = id;
		window.localStorage.setItem("id", id);
		console.log(this.id);
	}
	
	constructor(socket:WebSocket) {
		super();
		socket.addEventListener("open", () => {
			const storedId = window.localStorage.getItem("id");
			
			const receiveId = (data:MessageEvent<any>) => {
				let msg = decodeMessage(data.data);
				if(msg.meta.messageType == "supplyId") {
					this.setId(msg.data);
				}
			}

			if(storedId) {
				this.setId(storedId);
				this.sendMessage(socket, constructMessage("supplyId", storedId));
				this.bindMessageHandler(socket);
			} else {
				socket.addEventListener("message", (data) => {
					receiveId(data);
					this.bindMessageHandler(socket);
				} , {once:true});
				this.sendMessage(socket, constructMessage("requestId", ""));
			}
		}, {once:true});
	};


	private bindMessageHandler(socket:WebSocket) {
		socket.onmessage = (data) => {
			this.handleMessage(socket, decodeMessage(data.data))
		}
	}

	

	private handleMessage(socket:WebSocket, message:Message<MessageType>) {
		this.updateListeners(message, msg => this.sendMessage(socket, msg) );
	}
	
	public sendMessage(client:WebSocket, message:Message<MessageType>) {
		client.send(encodeMessage(message));
	}
}	