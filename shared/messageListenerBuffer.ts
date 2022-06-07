import { WebSocket } from "ws";
import { IMessageTypes, MessageDataType } from "./message";

export default function createMessageListenerBuffer() {
	const listeners: {
		[MessageType in keyof IMessageTypes]: 
			Set<(socket:WebSocket, data:MessageDataType<MessageType>) => void>
	} = {
		ping: new Set(),
	};
	return listeners;
}