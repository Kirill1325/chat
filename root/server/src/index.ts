import 'dotenv/config'
import express from 'express';
import http from 'http';
import { configure } from './config/appConfig';
import { createTables } from './config/dbConfig';
// import WebSocket, { WebSocketServer } from 'ws';
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { messageService } from './service/messageService';

const PORT = process.env.PORT || 3000

const app = express()

configure(app)

createTables()

const server = http.createServer(app)

console.log(`Attempting to run server on port ${PORT}`)

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  }
});


io.on('connection', (socket: Socket) => {

  console.log('a user connected');

  socket.on('join room', async (chatId: string, userId: number) => {
    await socket.join(chatId);
    console.log(`user ${userId} joined room ${chatId}`)
  });
  socket.on('leave room', async (chatId: string, userId: number) => {
    await socket.leave(chatId);
    console.log(`user ${userId} left room ${chatId}`)
  });

  socket.on('send message', async (userId: number, chatId: number, payload: string, createdAt: number) => {
    console.log(userId, chatId, payload, createdAt)
    const sentMessage = await messageService.sendMessage(userId, chatId, payload, createdAt)

    const recievedMessage = await messageService.getMessageById(sentMessage.message_id)

    socket.emit('receive message', recievedMessage)
  })

  socket.on('get messages', async (chatId: number) => {

    const messages = await messageService.getMessages(chatId)

    socket.emit('receive messages', messages)
  })

  socket.on('disconnect', () => console.log('user disconnected'));

})