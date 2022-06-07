import ClientSocketWrapper from "./clientSocketWrapper";

const socket = new WebSocket('ws://localhost:3000');

const wrapper = new ClientSocketWrapper(socket);

wrapper.on("ping", (socket, data) => {
	console.log(`ping: ${data}`);
})