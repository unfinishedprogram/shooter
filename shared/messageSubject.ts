import { WebSocket } from "ws";
import { IMessageTypes, Message, MessageDataType, MessageType } from "./message";


export default class MessageSubject {
	private listeners: {
		[MessageType in keyof IMessageTypes]: 
			Set<(socket:WebSocket, data:MessageDataType<MessageType>) => void>
	} = {
		ping: new Set(),
	}

	public on<T extends MessageType>(messageType:T, callback:(socket:WebSocket, data:MessageDataType<T>) => void) {
		this.listeners[messageType].add(callback);
	}
	
	public removeListener<T extends MessageType>(messageType:T, callback:(socket:WebSocket, data:MessageDataType<T>) => void) {
		this.listeners[messageType].delete(callback);
	}

	protected updateListeners(socket:WebSocket, message:Message<MessageType>) {
		this.listeners[message.meta.messageType].forEach(cb => {
			cb(socket, message.data);
		})
	}
}