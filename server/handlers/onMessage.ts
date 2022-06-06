import WebSocket from "ws";
import { Message } from "../message";

const onMessage = (message:Message<unknown>) => {
	console.log(message);
}

export default onMessage;