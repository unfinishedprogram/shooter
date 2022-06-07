import {constructMessage, Data, decodeMessage, encodeMessage, Message} from "../../shared/message";

export const handleMessage = (event:MessageEvent<any>):any => {
	console.log(decodeMessage(event.data));
}

export const sendMessage = (socket:WebSocket, msg:Message<any>) => {
	socket.send(encodeMessage(msg));
}

export const setupSocket = (socket:WebSocket) => {
	socket.onmessage = handleMessage;
	sendMessage(socket, constructMessage("ping", "Hello Server"));
}