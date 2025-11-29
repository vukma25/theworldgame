import mongoose from 'mongoose'

const leaderboardSchema = new mongooseSchema({
    game: { type: String, required: true },
    subcategory: { type: String },
    difficulties: { type: String },
    player: { type: mongooseSchema.Types.ObjectId, ref: 'User', required: true },
    stats: {
        elo: { type: Number, min: 0 },
        score: { type: Number, min: 0 },
        time: { type: Number, min: 0 },
        mistakes: { type: Number, min: 0 },
        turn: { type: Number, min: 0 },
        wpm: { type: Number, min: 0 },
        accuracy: { type: Number, min: 0, max: 100 },
        avgGuess: { type: Number, min: 0 },
        streak: { type: Number, min: 0 }
    }
}, { timestamps: true });

leaderboardSchema.index({ game: 1});
leaderboardSchema.index({ player: 1 });

export default mongoose.model('Leaderboard', leaderboardSchema)