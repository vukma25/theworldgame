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
            // Validate required fields
            if (!conversationId || !content || !sender || !sentAt) {
                return res.status(400).json({ message: "conversationId, content, and sender are required" });
            }

            // Validate ObjectIds
            if (!isValidObjectId(conversationId) || !isValidObjectId(sender)) {
                return res.status(400).json({ message: "Invalid conversationId or sender ID" });
            }

            // Check if conversation exists and user is a member
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
        let { messageId, newContent } = req.body;

        try {
            // Validate required fields
            if (!messageId || !newContent) {
                return res.status(400).json({ message: "messageId and newContent are required" });
            }

            // Validate ObjectId
            if (!isValidObjectId(messageId)) {
                return res.status(400).json({ message: "Invalid message ID" });
            }

            // Check if message exists
            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
                return res.status(404).json({ message: "Message not found" });
            }

            // Check if user is the sender of the message
            const { userId } = req.user; // Assuming user ID is in req.user from auth middleware
            if (!existingMessage.sender.equals(new ObjectId(userId))) {
                return res.status(403).json({ message: "You can only edit your own messages" });
            }

            const updatedMessage = await Message.findOneAndUpdate(
                { _id: new ObjectId(messageId) },
                {
                    content: newContent,
                    editedAt: new Date()
                },
                { new: true }
            );

            if (updatedMessage) {
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
            // Validate required fields
            if (!messageId || !conversationId) {
                return res.status(400).json({ message: "messageId is required" });
            }

            // Validate ObjectId
            if (!isValidObjectId(messageId) || !isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid message ID" });
            }

            // Check if message exists
            const existingMessage = await Message.findById(messageId);
            if (!existingMessage) {
                return res.status(404).json({ message: "Message not found" });
            }

            // Check if user is the sender or has admin rights
            const { userId, role } = req.user;
            const isSender = existingMessage.sender.equals(new ObjectId(userId));

            if (!isSender && role !== 'admin') {
                return res.status(403).json({ message: "You can only delete your own messages" });
            }

            const deletedMessage = await Message.findOneAndDelete({
                _id: new ObjectId(messageId)
            });

            if (deletedMessage) {
                Socs.emitToRoom(conversationId.toString(), 'message:delete', {deletedMessageId:deletedMessage._id})

                return res.json({
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
            // Validate required fields
            if (!conversationId || !userId) {
                return res.status(400).json({ message: "conversationId and userId are required" });
            }

            // Validate ObjectIds
            if (!isValidObjectId(conversationId) || !isValidObjectId(userId)) {
                return res.status(400).json({ message: "Invalid conversationId or userId" });
            }

            conversationId = new ObjectId(conversationId);
            userId = new ObjectId(userId);

            // Check if conversation exists and user is a member
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

            // Mark messages as read
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
                return res.status(404).send({message: "Not found messages or you read all them"})
            }

            // Reset unread count in conversation
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

            return res.status(404).send({message: "Not found number of unread message of user"})
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    getMessagesByConversation: async (req, res) => {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        try {
            // Validate ObjectId
            if (!isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid conversation ID" });
            }

            // Check if conversation exists and user is a member
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
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .populate('sender', '_id username avatar')
                .exec();

            const total = await Message.countDocuments({ conversationId: new ObjectId(conversationId) });

            return res.json({
                messages,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
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
            return res.status(200).send({message: "Clear"})
        } catch {
            return res.status(500).send({message:"Server error"})
        }

    }
};