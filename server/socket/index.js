import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import { socketMiddleware } from '../middleware/socket.js'
import Conversation from '../models/conversation.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
});

const onlineUsers = new Map()

io.use(socketMiddleware);

io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`User ${userId} connected`)

    //boardcast các user online
    onlineUsers.set(userId, socket.id)
    socket.emit('user:online', Array.from(onlineUsers))
    socket.broadcast.emit('user:online', Array.from(onlineUsers))

    socket.join(userId)
    socket.on('join:conversation', async () => {
        const conversations = await Conversation.find({ members: socket.user._id });
        conversations.forEach((conv) => {
            socket.join(conv._id.toString());
        })
    })

    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`)

        onlineUsers.delete(userId)
        socket.emit('user:online', Array.from(onlineUsers))
        socket.broadcast.emit('user:online', Array.from(onlineUsers))
    });
});

export { io, app, server };