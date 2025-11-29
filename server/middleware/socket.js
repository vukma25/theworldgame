import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const socketMiddleware = async (socket, next) => {
    const token = socket.handshake.auth?.accessToken;
    if (!token) return next(new Error('Authentication error'));

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_KEY);
        if (!decoded) {
            return next(new Error("Unauthorized"))
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user || user.isBanned) return next(new Error('You are banned!'));
        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
}