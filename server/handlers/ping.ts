import { WebSocket } from "ws";

const onPing = (socket:WebSocket, data:string) => {
	console.log(`ping: ${data}`);
}

export default onPing;