import mongoose from 'mongoose'

const wordleSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    streak: [{
        lengthWord: { type: Number, min: 0 },
        length: { type: Number, min: 0 },
        _id: false
    }],
    listGames: [{
        lengthWord: { type: Number, min: 4, max: 8 },
        status: { type: String, enum: ['win', 'lose'], required: true },
        guesses: { type: Number, min: 1 },
        _id: false
    }]
}, { timestamps: true });

wordleSchema.index({ player: 1 });

export default mongoose.model('Wordle', wordleSchema)