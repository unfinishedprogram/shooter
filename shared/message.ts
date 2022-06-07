export type Data = string | Buffer | ArrayBuffer | Buffer[];

export interface IMessageTypes {
	"ping":string,
}

export type MessageType = keyof IMessageTypes;

export type MessageDataType<T extends MessageType> = IMessageTypes[T];

export type Message<T extends MessageType> = {
	meta: {
		dateTime:number,
		messageType:T
	}
	data: MessageDataType<T>,
}

export function decodeMessage(data:Data):Message<MessageType> {
	return JSON.parse(`${data}`) as Message<MessageType>;
}

export function encodeMessage(message:Message<MessageType>):string {
	return JSON.stringify(message);
}

export function constructMessage<T extends MessageType>(messageType:T, messageData:MessageDataType<T>) {
	return {
		meta: {
			messageType,
			dateTime:Date.now(),
		},
		data : messageData,
	}
}