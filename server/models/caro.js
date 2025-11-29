import mongoose from 'mongoose'

const caroSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    highestScore: { type: Number, min: 0 },
    score: { type: Number, min: 0 },
    performance: [{
        size: { type: Number, enum: [3, 15, 25], required: true },
        score: { type: Number, min: 0 },
        time: { type: Date, default: Date.now },
        _id: false
    }]
}, { timestamps: true });

caroSchema.index({ player: 1 });

const caroMatchSchema = new Schema({
    XPlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    XScore: { type: Number, min: 0 },
    OPlayer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    OScore: { type: Number, min: 0 },
    winner: { type: String, enum: ['X', 'O', ''] },
    size: { type: Number, enum: [3, 15, 25] },
    moves: [{
        move: [{ type: Number, min: 0 }], // [x, y] => x * size + y
        timeX: { type: Number, min: 0 },
        timeO: { type: Number, min: 0 },
        _id: false
    }],
    endGame: {
        by: { type: String, enum: ['win', 'draw', 'timeout', 'resign'] },
        reason: { type: String }
    }
}, { timestamps: true });

caroMatchSchema.index({ XPlayer: 1 });
caroMatchSchema.index({ OPlayer: 1 });

export const caroMatch = mongoose.model('CaroMatch', caroMatchSchema)
export default mongoose.model('Caro', caroSchema)