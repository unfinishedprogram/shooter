import application, { static as _static } from "express";
import { createServer } from "http"
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import * as path from "path";
import ServerSocketWrapper from "./serverSocketWrapper";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ip = "localhost";
const port = 3000;
const app = application();
const httpServer = createServer(app);
const socketServer = new WebSocketServer({server:httpServer});
const staticPath = path.join(__dirname, '/public');

app.use('/', _static(staticPath))

const wrapper = new ServerSocketWrapper(socketServer);

console.log(`Listening at http://${ip}:${port}`);

httpServer.listen(3000);

export default wrapper;