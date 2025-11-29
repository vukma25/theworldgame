import mongoose from 'mongoose'

const snakeSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    highestScore: { type: Number, min: 0 },
    performance: [{
        mode: { type: String },
        map: { type: String },
        score: { type: Number, min: 0 },
        _id: false
    }]
}, { timestamps: true });

snakeSchema.index({ player: 1 });

export default mongoose.model('Snake', snakeSchema)