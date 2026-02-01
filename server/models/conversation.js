import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    name: { type: String, maxLength: 100 },
    avatar: { type: String },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        _id: false
    }],
    type: { type: String, enum: ['public', 'private'], default: 'private' },
    pinnedMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    requestJoin: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        _id: false
    }],
    unread: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        count: { type: Number, min: 0 },
        _id: false
    }]
});

conversationSchema.index({ members: 1 });
conversationSchema.index({ updateAt: -1 });

export default mongoose.model('Conversation', conversationSchema)