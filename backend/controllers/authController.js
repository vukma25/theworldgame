import User from '../models/user.js'
import Session from '../models/session.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_TTL = "30m"
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            if (!(username && email && password)) {
                return res.status(401).json({ message: "email or password cannot be left blank" })
            }

            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            user = new User({ username, email, password });
            await user.save();

            res.status(201).json({
                message: "Register successfully!",
                user: { id: user._id, username: user.username, email: user.email }
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error"
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(401).json({ message: "email or password cannot be left blank" })
            }

            console.log("Login ok")
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    message: "Incorrect email or password"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Incorrect email or password"
                });
            }

            if (user.isBanned) {
                return res.status(403).json({ message: "You are banned" })
            }

            const { _id: userId, isAdmin, isBanned } = user;
            const accessToken = jwt.sign(
                {
                    userId,
                    isAdmin,
                    isBanned
                },
                process.env.ACCESS_KEY,
                { expiresIn: ACCESS_TOKEN_TTL }
            )

            const refreshToken = jwt.sign(
                {
                    userId,
                    isAdmin,
                    isBanned
                },
                process.env.REFRESH_KEY,
                { expiresIn: REFRESH_TOKEN_TTL }
            )

            await Session.create({
                userId: user._id,
                isAdmin,
                isBanned,
                refreshToken,
                expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
            })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: "lax",
                maxAge: REFRESH_TOKEN_TTL,
            })
            console.log("Cookie set:", res.getHeader('Set-Cookie'))

            const { password: pwd, ...other } = user._doc;
            res.json({
                accessToken,
                user: other
            })

        } catch (error) {
            res.status(400).json({
                message: "Invalid credentials"
            });
        }
    },
    logout: async (req, res) => {

        try {
            console.log(req.cookies)
            const token = req.cookies?.refreshToken;
            console.log("Cookies:", token)

            await Session.deleteOne({ refreshToken: token });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: "lax",
                maxAge: REFRESH_TOKEN_TTL,
            });
            return res.status(200).json({ message: "Logout successfully" })


            //return res.status(403).json({ message: "Logout failure!"})
        } catch (error) {
            console.log('Miss an error', error);
            return res.status(500).json({ message: "Server error" })
        }
    },
    refresh: async (req, res) => {
        try {
            const token = req.cookies?.refreshToken;
            if (!token) {
                return res.status(401).json({ message: "Token is not exists" })
            }

            const session = await Session.findOne({ refreshToken: token });
            if (!session) {
                return res.status(403).json({ message: "Token is not valid or expired" });
            }

            if (session.expireAt < Date.now()) {
                return res.status(403).json({ message: "Token expired" });
            }

            const { userId, isAdmin, isBanned } = session;
            const accessToken = jwt.sign({
                userId,
                isAdmin,
                isBanned,
            }, process.env.ACCESS_KEY,
                { expiresIn: ACCESS_TOKEN_TTL }
            )

            return res.status(200).json({ accessToken });

        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    verify: async (req, res) => {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ valid: false, message: "Token is not valid or expired" });
        }

        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(403).json({ valid: false, message: "Token is not valid or expired" });
        }

        if (session.expireAt < Date.now()) {
            return res.status(403).json({ valid: false, message: "Token expired" });
        }

        return res.status(200).json({ valid: true, message: "Session is valid" })
    }

}

export default authController