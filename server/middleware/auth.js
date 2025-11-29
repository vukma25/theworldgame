import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                message: "No token, authorization denied!"
            });
        }

        jwt.verify(token, process.env.ACCESS_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token expired!" })
            }

            const user = await User.findOne({ _id: decoded.userId }).select('-password');

            if (!user) {
                return res.status(401).json({
                    message: "Token is not valid or expire!"
                });
            }
            if (user.isBanned) {
                return res.status(401).json({
                    message: "You are banned"
                });
            }

            req.user = user;
            next()
        });

    } catch (error) {
        res.status(500).json({
            message: `Server error`
        })
    }
}

export default auth