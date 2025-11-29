import mongoose from 'mongoose'

const fastfingerSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    highestRecord: {
        wpm: { type: Number, min: 0 },
        accuracy: { type: Number, min: 0, max: 100 }
    },
    listGames: [{
        time: { type: Number, enum: [15, 30, 60, 120], required: true },
        option: { type: String, enum: ['none', 'cap', 'mark', 'capmark'], required: true },
        wpm: { type: Number, min: 0 },
        accuracy: { type: Number, min: 0, max: 100 },
        _id: false
    }]
}, { timestamps: true });

fastfingerSchema.index({ player: 1 });

export default mongoose.model('Fastfinger', fastfingerSchema)