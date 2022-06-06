import {constructMessage, Data, decodeMessage, encodeMessage, Message} from "../../shared/message";

export const handleMessage = (data:Data) => {
	console.log(decodeMessage(data));
}

export const sendMessage = (socket:WebSocket, msg:Message<any>) => {
	socket.send(encodeMessage(msg));
}

export const setupSocket = (socket:WebSocket) => {
	socket.onmessage = console.log;
	
	sendMessage(socket, constructMessage({
		state: {
			"thing1": "value",
			"thing2": 123
		}
	}));
}