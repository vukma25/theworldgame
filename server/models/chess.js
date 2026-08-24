import mongoose from 'mongoose'

const GAME_TYPE_NAME = ['blitz', 'rapid'];

const chessSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: [{
        name: { type: String, enum: GAME_TYPE_NAME, require: true },
        classify: { type: Boolean, default: false },
        totalClassifyMatch: { type: Number, min: 0, max: 5 },
        totalMatch: { type: Number, min: 0 },
        elo: { type: Number, min: 0 },
        highestElo: { type: Number, min: 0 },
        _id: false
    }],
    performance: [{
        mode: { type: String, enum: GAME_TYPE_NAME, required: true },
        elo: { type: Number, min: 0 },
        time: { type: Date, default: Date.now },
        _id: false
    }]
}, { timestamps: true })

chessSchema.index({ player: 1 })

const chessMatchSchema = new mongoose.Schema({
    status: { type: String, enum: ['ongoing', 'finished'], default: 'ongoing' },
    mode: { type: String, enum: GAME_TYPE_NAME, required: true },
    white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    whiteElo: { type: Number, min: 0 },
    black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blackElo: { type: Number, min: 0 },
    time: [{ type: Number }],
    winner: { type: String, enum: ['black', 'white', ''] },
    moves: [{
        fen: { type: String },
        move: { type: String },
        timeWhite: { type: Number, min: 0 },
        timeBlack: { type: Number, min: 0 },
        _id: false
    }],
    endGame: {
        by: { type: String, enum: ['checkmate', 'draw', 'timeout', 'resign'] },
        reason: { type: String }
    }
}, { timestamps: true });

chessMatchSchema.index({ white: 1 });
chessMatchSchema.index({ black: 1 });
chessMatchSchema.index({ status: 1 });

export const ChessMatch = mongoose.model('ChessMatch', chessMatchSchema)
export default mongoose.model('Chess', chessSchema)