import { wrap } from "module";
import { constructMessage } from "../../shared/message";
import ClientSocketWrapper from "./clientSocketWrapper";

const socket = new WebSocket('ws://localhost:3000');

const wrapper = new ClientSocketWrapper(socket);

wrapper.on("ping", (data, respond) => {
	console.log(`ping: ${data}`);
})

wrapper.on("supplyId", (id, respond) => {
	wrapper.setId(id);
})