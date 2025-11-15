import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js'
import authRouter from './routers/auth.js'
import userRouter from './routers/user.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000
const MONGODB_URI = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@twg.cx9tbj4.mongodb.net/?appName=TWG`;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.json({
        message: "Game Platform API is running!"
    });
});

connectDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
        console.log(`Link: http://localhost:${PORT}`)
    })
});



