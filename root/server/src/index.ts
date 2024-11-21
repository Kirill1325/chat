import 'dotenv/config'
import express from 'express';
import http from 'http';
import { configure } from './config/appConfig';
import { createTables } from './config/dbConfig';
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { messageService } from './messages/messageService';
import chatsService from './chats/chatsService';

const PORT = process.env.PORT || 3000

const app = express()

configure(app)

createTables()

const server = http.createServer(app)

console.log(`Attempting to run server on port ${PORT}`)

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))

const io = new Server(server, {
  cors: {
    origin: '*',
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

  socket.on('send message', async (userId: number, chatId: number, payload: string, createdAt: string) => {
    console.log(userId, chatId, payload, createdAt)
    const sentMessage = await messageService.sendMessage(userId, chatId, payload, createdAt)

    const recievedMessage = await messageService.getMessageById(sentMessage.messageId) 
    //TODO: remove getMessageById completely if it's not used anywhere else
    // make messageService.sendMessage return full message

    socket.to(chatId.toString()).emit('send message', recievedMessage)
  })

  socket.on('get messages', async (chatId: number) => {

    const messages = await messageService.getMessages(chatId)

    socket.emit('get messages', messages)
  })

  socket.on('delete message', async (messageId: number, chatId: number) => {

    await messageService.deleteMessage(messageId)

    socket.to(chatId.toString()).emit('delete message', messageId)
  })

  socket.on('edit message', async (messageId: number, payload: string, chatId: number) => {

    await messageService.editMessage(messageId, payload)
    
    socket.to(chatId.toString()).emit('edit message', messageId, payload)
  })

  socket.on('get last message', async (chatId: number) => {
    const lastMessage = await messageService.getLastMessage(chatId)

    socket.emit('get last message', lastMessage)
  })

  socket.on('connect to chat', async (chatId: number, userId: number) => {
    await chatsService.connectToChat(chatId, userId)

    const chats = await chatsService.getChats(userId)

    socket.emit('connect to chat', chats)
  })

  socket.on('get chats', async (userId: number) => {
    // console.log('get chats', userId)
    const chats = await chatsService.getChats(userId)

    socket.emit('get chats', chats)
  })

  socket.on('disconnect', () => console.log('user disconnected'));

})