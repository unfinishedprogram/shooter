import { Message, MessageDataType, MessageType, messageTypes } from "./message";

export type OnMessageCallback = (
	data: MessageDataType<MessageType>, 
	respond: MessageResponseCallback
) => void;

export type MessageResponseCallback = (message:Message<MessageType>) => void; 
type MessageListeners =  {
	[MessageType in keyof typeof messageTypes]: Set<OnMessageCallback>
}

export default class MessageSubject {
	private listeners: MessageListeners = {} as MessageListeners;

	constructor(){
		for(let msgType in messageTypes) {
			this.listeners[msgType as keyof typeof messageTypes] = new Set();
		};
	}

	public on<T extends MessageType>(messageType:T, callback:OnMessageCallback) {
		this.listeners[messageType].add(callback);
	}
	
	public removeListener<T extends MessageType>(messageType:T, callback:OnMessageCallback) {
		this.listeners[messageType].delete(callback);
	}

	protected updateListeners(message:Message<MessageType>, respond: (message:Message<MessageType>) => void) {
		this.listeners[message.meta.messageType].forEach( cb => {
			cb(message.data, respond);
		})
	}
}