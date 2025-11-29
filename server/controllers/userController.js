import mongoose from 'mongoose'
import User from "../models/user.js"
import Notification from '../models/notification.js'
import { isValidObjectId } from "../utils/validateId.js"
import Socs from '../services/socketService.js'

const { ObjectId } = mongoose.Types;

const userController = {
    fetchUser: async (req, res) => {
        const user = req.user._doc;
        return res.status(200).json({ user });
    },
    getAllUser: async (req, res) => {
        try {
            const users = await User.find().select('username _id');
            return res.status(200).json({ users });
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    },
    sendFriendRequest: async (req, res) => {
        const { userId } = req.params;
        const { id } = req.body;

        try {
            if (!userId || !id) {
                return res.status(400).send({ message: "User id is required" });
            }
            if (!isValidObjectId(userId) || !isValidObjectId(id)) {
                return res.status(400).send({ message: "Invalid user id" });
            }

            const userReceiveRequest = await User.findOne({ _id: new ObjectId(userId) });
            const userSendRequest = await User.findOne({ _id: new ObjectId(id) })
            if (!userReceiveRequest || !userSendRequest) {
                return res.status(404).send({ message: "User does not exist" });
            }

            userReceiveRequest.friendRequests.push({
                from: userSendRequest._id,
                status: 'pending'
            });

            await userReceiveRequest.save();

            const notification = new Notification({
                userId: userReceiveRequest._id,
                type: "friend",
                fromUser: userSendRequest._id
            });

            await notification.save();

            Socs.emitToUser(userReceiveRequest._id.toString(), "notification:new:friend:request", {
                id: notification._id,
                user: userSendRequest._id,
                type: notification.type,
                unread: notification.unread,
                username: userSendRequest.username,
                avatar: userSendRequest.avatar
            })

            return res.status(200).send({
                message: "Send request succesfully",
                userReceiveRequest: userReceiveRequest._id
            })

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    handleFriendRequest: async (req, res) => {
        const { userId, id, notificationId, response } = req.body;

        try {
            if (!userId || !id || !notificationId) {
                return res.status(400).send({ message: "User id is required" });
            }
            if (!isValidObjectId(userId) || !isValidObjectId(id) || !isValidObjectId(notificationId)) {
                return res.status(400).send({ message: "Invalid user id" });
            }

            const userReceiveRequest = await User.findOne({ _id: new ObjectId(userId) });
            const userSendRequest = await User.findOne({ _id: new ObjectId(id) });
            if (!userReceiveRequest || !userSendRequest) {
                return res.status(404).send({ message: "User does not exist" });
            }

            let curNotification;
            if (['accept', 'reject'].includes(response)) {
                curNotification = await Notification.findOneAndDelete({ _id: new ObjectId(notificationId) })
                if (!curNotification) {
                    return res.status(404).send({ message: "Notification does not exist" });
                }


                userReceiveRequest.friendRequests = userReceiveRequest.friendRequests.filter(({ from }) => {
                    return !from.equals(new ObjectId(id));
                });

                let notification = null;

                if (response === 'accept') {
                    userReceiveRequest.friends.push(userSendRequest._id);
                    userSendRequest.friends.push(userReceiveRequest._id);

                    notification = new Notification({
                        userId: userSendRequest._id,
                        type: "friend:response",
                        content: `${userReceiveRequest.username} accepted your friend request. Now both of you can chat together`,
                        fromUser: userReceiveRequest._id
                    });
                } else {
                    notification = new Notification({
                        userId: userSendRequest._id,
                        type: "friend:response",
                        content: `${userReceiveRequest.username} rejected your friend request`,
                        fromUser: userReceiveRequest._id
                    });
                }

                await userReceiveRequest.save();
                await userSendRequest.save();
                await notification.save();

                Socs.emitToUser(userSendRequest._id.toString(), "notification:new:friend:response", { 
                    id: notification._id,
                    content: notification.content,
                    type: notification.type,
                    unread: notification.unread
                })
                Socs.emitToUser(userReceiveRequest._id.toString(), "notification:delete:friend:request", {
                    oldId: curNotification._id
                })                

                return res.status(200).send({
                    message: "Response successfully",
                    user: userSendRequest._id
                })
            }

            return res.status(400).send({ message: "Failed response" })

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

export default userController