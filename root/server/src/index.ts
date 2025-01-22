import 'dotenv/config'
import express from 'express';
import http from 'http';
import { configureServer, configureSocketServer } from './config/appConfig';
import { createTables } from './config/dbConfig';
import { Server, Socket } from "socket.io";
import { messageService } from './messages/messageService';
import chatsService from './chats/chatsService';
import { userService } from './user/userService';

const PORT = process.env.PORT || 3000

const app = express()

createTables()

const server = http.createServer(app)

console.log(`Attempting to run server on port ${PORT}`)

server.listen(PORT, () => console.log(`App listening on port ${PORT}`))

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

configureServer(app)
configureSocketServer(io)

// TODO: add reconnect
// TODO: remove SELECT *, RETURNING * from all queries
io.on('connection', (socket: Socket) => {

  console.log('a user connected', socket.data.id)

  io.sockets.emit('user connected', socket.data.id)

  const changeStatusToOnline = async () => {
    console.log('users ids', socket.data.id)
    await userService.changeStatusToOnline(socket.data.id)
  }
  changeStatusToOnline()

  socket.on('join room', async (chatId: string, userId: number) => {
    await socket.join(chatId);
    console.log(`user ${userId} joined room ${chatId}`)
  });
  socket.on('leave room', async (chatId: string, userId: number) => {
    await socket.leave(chatId);
    console.log(`user ${userId} left room ${chatId}`)
  });

  socket.on('get users', async () => {
    const users = await userService.getUsers()
    socket.emit('get users', users)
  })

  socket.on('search contacts', async (searchQuery: string) => {
    const users = await userService.getUsers(searchQuery)
    socket.emit('search contacts', users)
  })

  socket.on('send message', async (userId: number, chatId: number, payload: string, createdAt: string) => {
    const sentMessage = await messageService.sendMessage(userId, chatId, payload, createdAt)
    const recievedMessage = await messageService.getMessageById(sentMessage.messageId)
    io.sockets.in(chatId.toString()).emit('send message', recievedMessage)
  })

  socket.on('get messages', async (chatId: number) => {
    const messages = await messageService.getMessages(chatId)
    socket.emit('get messages', messages)
  })

  socket.on('delete message', async (messageId: number, chatId: number) => {
    await messageService.deleteMessage(messageId)
    io.sockets.in(chatId.toString()).emit('delete message', messageId)
  })

  socket.on('edit message', async (messageId: number, payload: string, chatId: number) => {
    await messageService.editMessage(messageId, payload)
    io.sockets.in(chatId.toString()).emit('edit message', messageId, payload)
  })

  socket.on('get last message', async (chatId: number) => {
    const lastMessage = await messageService.getLastMessage(chatId)
    io.sockets.emit('get last message', lastMessage)
  })

  socket.on('read message', async (messageId: number, chatId: number) => {
    const message = await messageService.readMessage(messageId)
    io.sockets.in(chatId.toString()).emit('read message', message)
  })

  socket.on('connect to dm', async (senderId: number, recipientId: number) => {
    const chat = await chatsService.connectToDm(senderId, recipientId)
    io.sockets.emit('connect to dm', chat)
  })

  socket.on('get chats', async (userId: number) => {
    const chats = await chatsService.getChats(userId)
    socket.emit('get chats', chats)
  })

  socket.on('search messages', async (query: string, chatId: number) => {
    const messagesIds = await messageService.searchMessages(query, chatId)
    io.sockets.in(chatId.toString()).emit('search messages', messagesIds)
  })

  socket.on('disconnect', async () => {
    console.log('user disconnected', socket.data.id)
    await userService.changeStatusToOffline(socket.data.id)
    io.sockets.emit('user disconnected', socket.data.id)
  });

})