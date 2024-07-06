import { Server } from "colyseus";
import { GameRoom } from "./rooms/gameRoom";
import { createServer } from "http";
import express from 'express';
import { WebSocketTransport } from '@colyseus/ws-transport';

require('dotenv').config();

const app = express();
const port = parseInt(process.env.NODE_ENV === 'production' ? process.env.PROD_SERVER_PORT : process.env.DEV_SERVER_PORT);

if (isNaN(port) || port < 0 || port > 65535) {
  throw new RangeError(`Invalid port number: ${port}. Port number should be >= 0 and < 65536.`);
}

const server = createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

gameServer.define('haya-game-expo', GameRoom)

server.listen(port, () => {
  console.log(`Listening on ws://localhost:${port}`);
});