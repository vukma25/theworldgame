import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import User from "../models/user.js"
import { isValidObjectId } from "../utils/validateId.js";
import Socs from "../services/socketService.js";

const { ObjectId } = mongoose.Types;

export const conversationController = {
    createPrivateConversation: async (req, res) => {
        let { members } = req.body;
        try {
            // Validate members
            if (!members || !Array.isArray(members) || members.length === 0) {
                return res.status(400).json({ message: "Members are required" });
            }

            // Remove duplicates
            members = [...new Set(members)];

            // Check if private conversation already exists between these members
            const existingConversation = await Conversation.findOne({
                type: { $ne: 'public' }, // private or group
                members: { $all: members, $size: members.length }
            });

            if (existingConversation) {
                return res.status(400).json({
                    message: "Conversation already exists",
                    conversationId: existingConversation._id
                });
            }

            const unread = [];

            members = members.map(mem => {
                if (!isValidObjectId(mem)) {
                    throw new Error(`Invalid member ID: ${mem}`);
                }
                const memberId = new ObjectId(mem);
                unread.push({
                    user: memberId,
                    count: 0
                });
                return memberId;
            });

            const newConversation = new Conversation({
                members,
                unread
            });

            await newConversation.save();
            const conv = await Conversation.
                findOne({_id: newConversation._id})
                .populate("members", "_id username avatar")
                .populate("lastMessage", "content")
                .exec()


            members.forEach(mem => {
                Socs.emitToUser(mem.toString(), 'conversation:new:private', conv)
            })

            return res.status(201).json({
                message: "Private conversation created successfully",
                conversationId: newConversation._id
            });

        } catch (err) {
            console.error(err);
            if (err.message.includes("Invalid member ID")) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: "Server error" });
        }
    },
    // chỉ dành cho admin
    createPublicConversation: async (req, res) => {
        const { name, avatar } = req.body;
        const { role } = req.user;

        try {
            if (role !== 'admin') {
                return res.status(403).json({ message: "You are not allowed" });
            }

            if (!name) {
                return res.status(400).json({ message: "Conversation name is required" });
            }

            const users = await User.find({}).select('-password');
            const unread = [];

            const members = users.map(user => {
                unread.push({
                    user: user._id,
                    count: 0
                });
                return user._id;
            });

            const newConversation = new Conversation({
                name,
                avatar,
                members,
                unread,
                type: 'public'
            });

            await newConversation.save();
            return res.status(201).json({
                message: "Public conversation created successfully",
                conversationId: newConversation._id
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    updateNameConversation: async (req, res) => {
        const { name, conversationId } = req.body;
        const { role } = req.user;

        try {
            if (role !== 'admin') {
                return res.status(403).json({ message: "You are not allowed" });
            }

            if (!isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid conversation ID" });
            }

            if (!name) {
                return res.status(400).json({ message: "Conversation name is required" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            await Conversation.findByIdAndUpdate(
                conversationId,
                { name }
            );

            return res.json({ message: "Conversation name updated successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    updateAvatarConversation: async (req, res) => {
        const { avatar, conversationId } = req.body;
        const { role } = req.user;

        try {
            if (role !== 'admin') {
                return res.status(403).json({ message: "You are not allowed" });
            }

            if (!isValidObjectId(conversationId)) {
                return res.status(400).json({ message: "Invalid conversation ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            await Conversation.findByIdAndUpdate(
                conversationId,
                { avatar }
            );

            return res.json({ message: "Conversation avatar updated successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    kichMember: async (req, res) => {
        const { conversationId, userId } = req.body;
        const { role } = req.user;

        try {
            if (role !== 'admin') {
                return res.status(403).json({ message: "You are not allowed" });
            }

            if (!isValidObjectId(conversationId) || !isValidObjectId(userId)) {
                return res.status(400).json({ message: "Invalid conversation ID or user ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            conversation.members = conversation.members.filter(mem => (
                !mem.equals(new ObjectId(userId))
            ));

            await conversation.save();

            return res.json({ message: "Member kicked successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    censorMember: async (req, res) => {
        const { conversationId, userId, status } = req.body;
        const { role } = req.user;

        try {
            if (role !== 'admin') {
                return res.status(403).json({ message: "You are not allowed" });
            }

            if (!isValidObjectId(conversationId) || !isValidObjectId(userId)) {
                return res.status(400).json({ message: "Invalid conversation ID or user ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            if (status === 'accepted' || status === 'rejected') {
                const id = new ObjectId(userId);

                conversation.requestJoin = conversation.requestJoin.filter(({ from }) => {
                    return !from.equals(id);
                });

                if (status === 'accepted') {
                    // Check if member already exists
                    const isMemberExists = conversation.members.some(mem =>
                        mem.equals(id)
                    );
                    if (!isMemberExists) {
                        conversation.members.push(id);
                    }
                }

                await conversation.save();
                return res.json({
                    message: `Join request ${status} successfully`,
                    status
                });
            }

            return res.status(400).json({ message: "Invalid status" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    updatePinnedMessage: async (req, res) => {
        const { messageId, conversationId } = req.body;

        try {
            if (!isValidObjectId(conversationId) || !isValidObjectId(messageId)) {
                return res.status(400).json({ message: "Invalid conversation ID or message ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            await Conversation.findByIdAndUpdate(
                conversationId,
                { $set: { pinnedMessage: new ObjectId(messageId) } }
            );

            return res.json({ message: "Pinned message updated successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    updateLastMessage: async (req, res) => {
        const { messageId, conversationId } = req.body;

        try {
            if (!isValidObjectId(conversationId) || !isValidObjectId(messageId)) {
                return res.status(400).json({ message: "Invalid conversation ID or message ID" });
            }

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found" });
            }

            await Conversation.findByIdAndUpdate(
                conversationId,
                { $set: { lastMessage: new ObjectId(messageId) } }
            );

            return res.json({ message: "Last message updated successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },

    addMember: async (req, res) => {
        const { userId } = req.body;
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            if (!isValidObjectId(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            await Conversation.updateMany(
                { type: 'public' },
                { $addToSet: { members: new ObjectId(userId) } },
                { session }
            );

            await session.commitTransaction();
            return res.json({ message: "User added to all public conversations successfully" });

        } catch (err) {
            await session.abortTransaction();
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        } finally {
            session.endSession();
        }
    },

    getAllConversation: async (req, res) => {
        const { id } = req.body;

        try {
            if (!id) {
                return res.status(400).send({ message: "Id is required" });
            }
            if (!isValidObjectId(id)) {
                return res.status(400).send({ message: "Id is not valid" });
            }

            const conversations = await Conversation
                .find({ members: { $in: [new ObjectId(id)] } })
                .populate("members", "_id username avatar")
                .populate("lastMessage", "content")
                .exec();
            if (!conversations) return res.status(404).send({message: "Not found any conversation"});

            return res.status(200).send({ message: "Get all conversation successfully", conversations})
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: "Server error" })
        }
    }
}