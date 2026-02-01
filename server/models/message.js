import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sentAt: { type: Date, default: Date.now },
    content: { type: String, required: true, maxlength: 5000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', _id: false }],
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ conversationId: 1, sentAt: -1 })
messageSchema.index({ sender: 1 })

export default mongoose.model('Message', messageSchema);