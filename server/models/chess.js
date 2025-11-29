import mongoose from 'mongoose'

const chessSchema = new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    classify: {type: Boolean, default: true},
    elo: {
        blizt: {type: Number, min: 0},
        rapid: {type: Number, min: 0}
    },
    highestElo: {
        blizt: {type: Number, min: 0},
        rapid: {type: Number, min: 0}
    },
    performance: [{
        mode: {type: String, enum: ['blitz', 'rapid'], required: true},
        elo: {type: Number, min: 0},
        time: {type: Date, default: Date.now},
        _id: false
    }]
}, {timestamps: true})

chessSchema.index({player: 1})

const chessMatchSchema = new mongoose.Schema({
    status: { type: String, enum: ['ongoing', 'finished'], default: 'ongoing' },
    mode: { type: String, enum: ['blitz', 'rapid'], required: true },
    white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    whiteElo: { type: Number, min: 0 },
    black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blackElo: { type: Number, min: 0 },
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

chessMatchesSchema.index({ white: 1 });
chessMatchesSchema.index({ black: 1 });
chessMatchesSchema.index({ status: 1 });

export const ChessMatch = mongoose.model('ChessMatch', chessMatchSchema)
export default mongoose.model('Chess', chessSchema)