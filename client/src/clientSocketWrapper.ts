import { decodeMessage, encodeMessage, Message, MessageType } from "../../shared/message";
import MessageSubject from "../../shared/messageSubject";
import createMessageListenerBuffer from "../../shared/messageSubject"

export default class ClientSocketWrapper extends MessageSubject {
	constructor(socket:WebSocket) {
		super();
		socket.onopen = () => {
			socket.onmessage = (data) => {
				this.handleMessage(socket, decodeMessage(data.data))
			}
		}
	}

	private handleMessage(socket:WebSocket, message:Message<MessageType>) {
		this.updateListeners(socket as any, message)
	}
	
	public sendMessage(client:WebSocket, message:Message<MessageType>) {
		client.send(encodeMessage(message));
	}
}	