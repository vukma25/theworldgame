import mongoose from 'mongoose'

const memorySchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listGames: [{
        status: {type: String, enum: ['win', 'lose'], required: true},
        numberCard: { type: Number, enum: [16, 20, 24, 30, 36], required: true },
        turn: { type: Number, min: 0 },
        time: { type: Number, min: 0 },
        _id: false
    }]
}, { timestamps: true });

memorySchema.index({ player: 1 });

export default mongoose.model('Memory', memorySchema)