import mongoose from "mongoose";
import Notification from "../models/notification.js";
import Socs from "../services/socketService.js";
import { isValidObjectId } from "../utils/validateId.js";

const { ObjectId } = mongoose.Types;

function modifyNotifications(notifications) {
    return notifications.map(no => {
        const { type, _id, fromUser: { username, avatar, _id: id}, content, unread } = no;
        if (type === "friend") {
            return {
                title: "New friend request",
                content: `${username} want to make friend`,
                reveal: {
                    id: _id,
                    user: id,
                    type,
                    unread,
                    username,
                    avatar
                }
            };
        } else {
            return {
                title: "New friend response",
                content,
                reveal: {
                    id: _id,
                    content,
                    type,
                    unread,
                }
            };
        }
    })
}

export const notificationController = {
    deleteNotification: async (req, res) => {
        const { notificationId, id } = req.body;

        try {
            if (!notificationId || !id) {
                return res.status(400).send({ message: "ID is required" });
            }
            if (!isValidObjectId(notificationId) || !isValidObjectId(id)) {
                return res.status(400).send({ message: "ID is not valid" });
            }

            const notification = await Notification.findOneAndDelete({ _id: new ObjectId(notificationId) });
            if (!notification) {
                return res.status(404).send({ message: "This notification does not exist" });
            }

            Socs.emitToUser(id, "notification:delete", {notificationId});

            return res.status(200).send({message: "Delete notification successfully"})
        } catch (err) {
            console.error(err);
            return res.status(500).send({message: "Server error"});
        }
    },

    readNotification: async (req, res) => {
        const { notificationId, id } = req.body;

        try {
            if (!notificationId || !id) {
                return res.status(400).send({ message: "ID is required" });
            }
            if (!isValidObjectId(notificationId) || !isValidObjectId(id)) {
                return res.status(400).send({ message: "ID is not valid" });
            }

            const notification = await Notification.findOneAndUpdate(
                { _id: new ObjectId(notificationId) },
                { unread: false }
            );
            if (!notification) {
                return res.status(404).send({ message: "This notification does not exist" });
            }

            Socs.emitToUser(id.toString(), "notification:read", {notificationId});

            return res.status(200).send({ message: "Read notification successfully" })
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server error" });
        }
    },

    getAllNotification: async (req, res) => {
        const { id } = req.body;

        try {
            if (!id) {
                return res.status(400).send({message: "ID is required"});
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({message: "ID is not valid"});
            }

            const notifications = await Notification
                .find({userId: new ObjectId(id)})
                .populate("fromUser", "username avatar _id");

            if (!notifications) {
                return res.status(404).sed({message: "Not found any notification"})
            }

            const finalRes = modifyNotifications(notifications);

            return res.status(200).send({ notifications: finalRes });
        } catch (err) {
            console.error(err);
            return res.status(500).send({message: "Server error"});
        }
    }
}