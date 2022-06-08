import { constructMessage } from "../../shared/message";
import { MessageResponseCallback } from "../../shared/messageSubject";

const onPing = (data:string, respond:MessageResponseCallback) => {
	console.log(`ping: ${data}`);
	respond(constructMessage("ping", "This is a response"))
}

export default onPing;