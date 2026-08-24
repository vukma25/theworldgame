import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js'
import authRouter from './routers/auth.js';
import userRouter from './routers/user.js';
import messageRouter from './routers/message.js';
import conversationRouter from './routers/conversation.js';
import notificationRouter from './routers/notification.js';
import gameRouter from './routers/games/index.js'
import leaderBoardRouter from './routers/leaderboard/index.js'
import { io, app, server } from './socket/index.js';
import Socs from './services/socketService.js'
import redis from './services/redisService.js';

dotenv.config();

const PORT = process.env.PORT || 5000
const MONGODB_URI = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@twg.cx9tbj4.mongodb.net/?appName=TWG`;

Socs.setIO(io);
// redis.connect()
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/game', gameRouter);
app.use('/api/leaderboard', leaderBoardRouter);

app.get('/', (req, res) => {
    res.json({
        message: "Game Platform API is running!"
    });
});

connectDB(MONGODB_URI).then(() => {
    server.listen(PORT, () => {
        console.log(process.env.NODE_ENV)
        console.log(`Server running on ${PORT}`)
        console.log(`Link: http://localhost:${PORT}`)
    })
});



