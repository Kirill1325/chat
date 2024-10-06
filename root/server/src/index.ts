import 'dotenv/config'
import express from 'express';
import http from 'http';
import { configure } from './config/appConfig';
import { createTables } from './config/dbConfig';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const PORT = process.env.PORT || 3000

const app = express()

configure(app)

createTables()

const server = http.createServer(app)

console.log(`Attempting to run server on port ${PORT}`)

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))

const webSocketServer = new WebSocketServer({ server });

const rooms = {}

webSocketServer.on('connection', function connection(ws) {

    const uuid = uuidv4(); // create here a uuid for this connection

    const leave = room => {
        // not present: do nothing
        if (!rooms[room][uuid]) return;

        // if the one exiting is the last one, destroy the room
        if (Object.keys(rooms[room]).length === 1) delete rooms[room];
        // otherwise simply leave the room
        else delete rooms[room][uuid];
    };

    ws.on('error', console.error)

    ws.on('message', function message(data, isBinary) {
        webSocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
})