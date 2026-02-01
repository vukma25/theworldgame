import mongoose from 'mongoose'
import User from "../models/user.js"
import Notification from '../models/notification.js'
import { isValidObjectId } from "../utils/validateId.js"
import Socs from '../services/socketService.js'
//import cloudinary from '../services/cloudinary.js'
import { v2 as cloudinary } from 'cloudinary'

const { ObjectId } = mongoose.Types;

const userController = {
    fetchMe: async (req, res) => {
        const user = req.user._doc;
        return res.status(200).json({ user });
    },
    fetchMeDetail: async (req, res) => {
        try {
            const user = await User.findById({ _id: req.user._id })
                .select("_id username email avatar bio role friends createdAt socialLinks")
                .populate("friends", "_id username avatar");

            if (!user) { return res.status(404).json({ message: "User does not exist" }) };

            return res.status(200).json({ user });
        } catch (err) {
            console.log("Server error");
            return res.status(500).json({ message: "Get information failed" });
        }
    },
    fetchAnotherUser: async (req, res) => {
        try {
            const id = req.params.id;

            if (!id || !isValidObjectId(id)) { return res.status(400).json({ message: "Id is missed or format is not correct" }) };

            const user = await User.findById({ _id: new ObjectId(id) })
                .select("_id username email avatar bio role friendRequests createdAt");

            if (!user) { return res.status(404).json({ message: "User does not exist" }) }

            return res.status(200).json({ user })
        } catch (err) {
            console.log("Server error");
            return res.status(500).json({ message: "Get other's information failed" });
        }
    },
    getAllUser: async (req, res) => {
        try {
            const users = await User.find().select('username _id avatar');
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
                    unread: notification.unread,
                    friendId: response === 'accept' ? userReceiveRequest._id : null
                })
                Socs.emitToUser(userReceiveRequest._id.toString(), "notification:delete:friend:request", {
                    oldId: curNotification._id,
                    friendId: response === 'accept' ? userSendRequest._id : null
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
    },
    uploadAvatar: async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file is uploaded" })

            const file = req.file;
            const { userId } = req.body;
            if (!userId || !isValidObjectId(userId)) return res.status(400).json({ message: "Miss id or image file" });

            const user = await User.findOne({ _id: new ObjectId(userId) });
            if (!user) { return res.status(404).json({ message: "User does not exist" }) };

            const imageURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            const timestamp = Math.round((new Date).getTime() / 1000);
            const upload_preset = "TWG_media";

            let params_to_sign = {
                timestamp,
                upload_preset,
            };

            if (user?.publicId && user?.publicId?.length !== 0) {
                params_to_sign.public_id = user.publicId;
                params_to_sign.overwrite = true;
            }

            const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_API_SECRET);

            const uploadOptions = {
                ...params_to_sign,
                api_key: process.env.CLOUDINARY_API_KEY,
                signature,
            };

            const uploadResult = await cloudinary.uploader.upload(imageURI, uploadOptions);

            user.avatar = uploadResult.secure_url;
            user.publicId = uploadResult.public_id;
            user.save();
            Socs.emitToUser(userId.toString(), "upload:avatar", { url: uploadResult.secure_url });

            return res.status(200).json({ message: "Upload avatar successfully" })

        } catch (err) {
            console.log("Server error: ", err);
            return res.status(500).json({ message: "upload image failed" })
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { id, username, email, bio, socialLinks } = req.body;
            if (!id || !username || !email || !(typeof bio === 'string') || !socialLinks) {
                return res.status(400).json({ message: "Request miss parameter" });
            }
            if (!isValidObjectId(id)) return res.status(400).json({ message: "Id is not valid" })

            const update = await User.findOneAndUpdate({ _id: new ObjectId(id) }, {
                $set: {
                    username, email, bio, socialLinks
                }
            }, { new: true });

            if (!update) return res.status(404).json({ message: "Can not found user or update failed" });

            return res.status(200).json({
                username: update.username,
                email: update.email,
                bio: update.bio,
                socialLinks: update.socialLinks
            })
        } catch (err) {
            console.log("Server error: ", err);
            return res.status(500).json({ message: "Can not update profile" })
        }
    }
}

export default userController