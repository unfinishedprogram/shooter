import SocketWrapper from "./SocketWrapper";

const socket = new WebSocket('ws://localhost:3000');

const wrapper = new SocketWrapper(socket);

wrapper.on("ping", (socket, data) => {
	console.log(`ping: ${data}`);
})