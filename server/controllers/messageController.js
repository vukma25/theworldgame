import mongoose from 'mongoose';
import Message from '../models/message.js'
import Conversation from '../models/conversation.js'
import { isValidObjectId } from '../utils/validateId.js';
import Socs from '../services/socketService.js'

const { ObjectId } = mongoose.Types;

export const messageController = {
    sendMessage: async (req, res) => {
        let { conversationId, content, sentAt, sender } = req.body;

        try {
            if (!conversationId || !content || !sender || !sentAt) {
                return res.status(400).json({ message: "conversationId, content, and sender are required" });
            }

            if (!isValidObjectId(conversationId) || !isValidObjectId(sender)) {
                return res.status(400).json({ message: "Invalid conversationId or sender ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            const isMember = conversation.members.some(member =>
                member.equals(new ObjectId(sender))
            );

            if (!isMember) {
                return res.status(403).json({ message: "You are not a member of this conversation" });
            }

            conversationId = new ObjectId(conversationId);
            sender = new ObjectId(sender);

            const message = new Message({
                conversationId,
                content,
                sentAt: sentAt || new Date(),
                sender,
                readBy: [sender]
            });

            await message.save();
            conversation.lastMessage = message._id;

            conversation.unread.forEach(unreadEntry => {
                if (!unreadEntry.user.equals(sender)) {
                    unreadEntry.count += 1;
                }
            });
            await conversation.save();
            const newMessages = await Message.findOne({ _id: message._id })
                .populate('sender', '_id username avatar')
                .exec();

            Socs.emitToRoom(conversationId.toString(), 'message:new', newMessages)
            conversation.unread.forEach((unreadEntry) => {
                const { user, count } = unreadEntry;

                if (!user.equals(sender)) {
                    Socs.emitToUser(user.toString(), 'unread:update', {
                        conversationId,
                        unread: count
                    })
                }
            });

            return res.status(200).json({
                message: "Message sent successfully",
                messageId: message._id
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    editMessage: async (req, res) => {
        let { conversationId, messageId, newContent } = req.body;

        try {
            if (!conversationId || !messageId || !newContent) {
                return res.status(400).json({ message: "messageId and newContent are required" });
            }

            if (!isValidObjectId(messageId) && !isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid message ID" });
            }

            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
                return res.status(404).json({ message: "Message not found" });
            }

            const { _id: userId } = req.user;
            if (!existingMessage.sender.equals(new ObjectId(userId))) {
                return res.status(403).json({ message: "You can only edit your own messages" });
            }

            const updatedMessage = await Message.findOneAndUpdate(
                { _id: new ObjectId(messageId) },
                {
                    content: newContent,
                    edited: true,
                    editedAt: new Date()
                },
                { new: true }
            );

            if (updatedMessage) {
                const room = new ObjectId(conversationId)
                Socs.emitToRoom(room.toString(), 'message:edit', {
                    messageId, newContent
                })

                return res.json({
                    message: "Message updated successfully",
                    updatedMessage
                });
            }

            return res.status(500).json({ message: "Failed to update message" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    deleteMessage: async (req, res) => {
        let { messageId, conversationId } = req.body;

        try {
            if (!messageId || !conversationId) {
                return res.status(400).json({ message: "messageId is required" });
            }

            if (!isValidObjectId(messageId) || !isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid message ID" });
            }

            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
                return res.status(404).json({ message: "Message not found" });
            }

            const { _id: userId, role } = req.user;
            const isSender = existingMessage.sender.equals(new ObjectId(userId));

            if (!isSender && role !== 'admin') {
                return res.status(403).json({ message: "You can only delete your own messages" });
            }

            const deletedMessage = await Message.findOneAndDelete({
                _id: new ObjectId(messageId)
            });

            if (deletedMessage) {

                let isPin = false
                if (existingMessage.pinned) {
                    await Conversation.updateOne(
                        { _id: new ObjectId(conversationId) },
                        { $pull: { pinnedMessage: existingMessage._id } },
                        { new: true }
                    )
                    isPin = true
                }

                const newLastMessage = await Message.find({ conversationId: new ObjectId(conversationId) }).sort({ sentAt: -1 }).limit(1);

                await Conversation.updateOne(
                    { _id: new ObjectId(conversationId) },
                    {
                        $set: {
                            lastMessage: newLastMessage.length > 0 ?
                                newLastMessage[0]._id : null
                        }
                    }
                )

                Socs.emitToRoom(conversationId.toString(), 'message:delete', { deletedMessageId: deletedMessage._id, isPin })

                return res.status(200).json({
                    message: "Message deleted successfully",
                    deletedMessageId: deletedMessage._id
                });
            }

            return res.status(500).json({ message: "Failed to delete message" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    readMessage: async (req, res) => {
        let { conversationId, userId } = req.body;

        try {
            if (!conversationId || !userId) {
                return res.status(400).json({ message: "conversationId and userId are required" });
            }

            if (!isValidObjectId(conversationId) || !isValidObjectId(userId)) {
                return res.status(400).json({ message: "Invalid conversationId or userId" });
            }

            conversationId = new ObjectId(conversationId);
            userId = new ObjectId(userId);

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            const isMember = conversation.members.some(member =>
                member.equals(userId)
            );

            if (!isMember) {
                return res.status(403).json({ message: "You are not a member of this conversation" });
            }

            const unreadMessage = await Message.find({
                conversationId,
                readBy: { $ne: userId }
            })

            const updateResult = await Message.updateMany(
                {
                    conversationId,
                    readBy: { $ne: userId }
                },
                {
                    $addToSet: { readBy: userId }
                }
            );

            if (!updateResult) {
                return res.status(404).send({ message: "Not found messages or you read all them" })
            }

            const convo = await Conversation.findById(conversationId);
            const unreadEntry = convo.unread.find(u => u.user.equals(userId));
            if (unreadEntry) {
                unreadEntry.count = 0;
                await convo.save();

                Socs.emitToUser(userId.toString(), 'unread:update', {
                    conversationId,
                    unread: 0
                });
                Socs.emitToRoom(conversationId.toString(), 'message:read', { userReadMessage: userId, count: unreadMessage?.length });

                return res.status(200).json({
                    message: "Messages marked as read successfully",
                    modifiedCount: updateResult.modifiedCount
                });
            }

            return res.status(404).send({ message: "Not found number of unread message of user" })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    pinMessage: async (req, res) => {
        try {
            let { messageId, conversationId } = req.body;
            if (!messageId || !conversationId) return res.status(400).json({ "message": "Lack of a message or conversation identify" });

            if (!isValidObjectId(messageId) || !isValidObjectId(conversationId)) return res.status(400).json({ "message": "Message identify is not valid" });

            const message = await Message.findOne({ _id: new ObjectId(messageId) });
            const conversation = await Conversation.findOne({ _id: new ObjectId(conversationId) });

            if (!message || !conversation) return res.status(404).json({ "message": "Message or conversation does not exist" });

            const updated = await Conversation.updateOne(
                { _id: new ObjectId(conversationId) },
                { $addToSet: { pinnedMessage: message._id } },
                { new: true }
            )

            message.pinned = true;
            message.save();

            if (updated) {
                const room = new ObjectId(conversationId);
                Socs.emitToRoom(room.toString(), "message:pin", { messageId })
                return res.status(200).json({ "message": "Update successfully" });
            }

            return res.status(500).json({ "message": "Update failed" });

        } catch (err) {
            console.log("Server error: ", err);
            return res.status(500).json({ "message": "Pin message failed" });
        }
    },

    unPinMessage: async (req, res) => {
        const { messageId, conversationId } = req.body;

        try {

            if (!messageId || !conversationId) return res.status(400).json({ "message": "Lack of a message or conversation identify" });

            if (!isValidObjectId(messageId) || !isValidObjectId(conversationId)) return res.status(400).json({ "message": "Message identify is not valid" });

            const message = await Message.findOne({ _id: new ObjectId(messageId) });
            const conversation = await Conversation.findOne({ _id: new ObjectId(conversationId) });

            if (!message || !conversation) return res.status(404).json({ "message": "Message or conversation does not exist" });

            const updated = await Conversation.updateOne(
                { _id: new ObjectId(conversationId) },
                { $pull: { pinnedMessage: message._id } },
                { new: true }
            )

            message.pinned = false;
            message.save();

            if (updated) {
                const room = new ObjectId(conversationId);
                Socs.emitToRoom(room.toString(), "message:un:pin", { messageId })
                return res.status(200).json({ "message": "Update successfully" });
            }

        } catch (e) {
            console.log("Server error: ", err);
            return res.status(500).json({ "message": "Un pin message failed" });
        }
    },

    getFirstMessageInConversation: async (req, res) => {
        const FIRST = 10
        const { conversationId } = req.params;

        try {
            if (!isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid conversation ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            const { _id } = req.user;
            const isMember = conversation.members.some(member => {
                return member.equals(_id)
            });

            if (!isMember) {
                return res.status(403).json({ message: "You are not a member of this conversation" });
            }

            const unreadMessages = await Message.find({
                conversationId: conversation._id,
                readBy: { $ne: _id }
            });

            const messages = await Message.find({ conversationId: new ObjectId(conversationId) })
                .sort({ sentAt: -1 })
                .limit(FIRST)
                .populate('sender', '_id username avatar')
                .exec();

            const total = await Message.countDocuments({ conversationId: new ObjectId(conversationId) });

            return res.status(200).json({
                messages,
                totalMessages: total,
                unread: unreadMessages?.length > FIRST ? unreadMessages?.length - FIRST : 0,
                hasMore: FIRST < total
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    getMoreMessageInConversation: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const { skip, limit } = req.body;
            if ((!skip && skip !== 0) || !limit) return res.status(400).json({ message: "Missing parameter" });
            const s = parseInt(skip);
            const l = parseInt(limit);

            if (!isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid conversation ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            const { _id } = req.user;
            const isMember = conversation.members.some(member => {
                return member.equals(_id)
            });

            if (!isMember) {
                return res.status(403).json({ message: "You are not a member of this conversation" });
            }

            const messages = await Message.find({ conversationId: new ObjectId(conversationId) })
                .sort({ sentAt: -1 })
                .skip(s)
                .limit(l)
                .populate('sender', '_id username avatar')
                .exec();

            const total = await Message.countDocuments({ conversationId: new ObjectId(conversationId) });

            return res.json({
                messages,
                totalMessages: total
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    deleteAllMessage: async (req, res) => {
        try {
            await Message.deleteMany({ deleted: false })
            return res.status(200).send({ message: "Clear" })
        } catch {
            return res.status(500).send({ message: "Server error" })
        }

    }
};