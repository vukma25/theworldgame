import User from '../models/user.js'
import Session from '../models/session.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isValidObjectId } from 'mongoose'

const ACCESS_TOKEN_TTL = "10m"
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

            const { _id: userId, role, isBanned } = user;
            const accessToken = jwt.sign(
                {
                    userId,
                    role,
                    isBanned
                },
                process.env.ACCESS_KEY,
                { expiresIn: ACCESS_TOKEN_TTL }
            )

            const refreshToken = jwt.sign(
                {
                    userId,
                    role,
                    isBanned
                },
                process.env.REFRESH_KEY,
                { expiresIn: REFRESH_TOKEN_TTL }
            )

            await Session.create({
                userId: user._id,
                refreshToken,
                expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
            })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: REFRESH_TOKEN_TTL,
            })

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
            const token = req.cookies?.refreshToken;

            const session = await Session.findOneAndDelete({ refreshToken: token });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: REFRESH_TOKEN_TTL,
            });
            return res.status(200).json({ message: "Logout successfully" })
        } catch (error) {
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

            const user = await User.findOne({ _id: session.userId })
            const { _id: userId, role, isBanned } = user;
            const accessToken = jwt.sign({
                userId,
                role,
                isBanned,
            }, process.env.ACCESS_KEY,
                { expiresIn: ACCESS_TOKEN_TTL }
            )

            return res.status(200).json({ accessToken });

        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    verifyAction: async (req, res) => {
        try {
            const { id, password } = req.body;
            if (!id || !password || !isValidObjectId(id)) return res.status(400).json({ message: "Request miss parameter or format is not correct" });

            const user = await User.findOne({ _id: new Object(id) })
            if (!user) return res.status(404).json({ message: "User does not exist" });

            const verify = await bcrypt.compare(password, user.password);
            if (!verify) {
                return res.status(403).json({ message: "Action is denied" });
            }

            return res.status(200).json({ message: "allow to continue" });

        } catch (err) {
            console.log("Server error: ", err);
            return res.status(500).json({ message: "Can not verify" })
        }
    }
}

export default authController