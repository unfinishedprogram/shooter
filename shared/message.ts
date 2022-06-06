export type Data = string | Buffer | ArrayBuffer | Buffer[];

export type Message<T> = {
	meta: {
		dateTime:number,
	}
	data: T,
}

export function decodeMessage(data:Data):Message<unknown> {
	return JSON.parse(`${data}`);
}

export function constructMessage<T>(data:T):Message<T> {
	return {
		meta: {
			dateTime:Date.now(),
		},
		data
	}
}

export function encodeMessage(message:Message<unknown>):string {
	return JSON.stringify(message);
}