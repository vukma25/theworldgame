import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    type: {type: String, required: true},
    content: {type: String},
    fromUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    unread: {type: Boolean, default: true},
});

export default mongoose.model('Notification', notificationSchema);