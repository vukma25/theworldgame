import mongoose from 'mongoose'

const minesweeperSchema = new mongoose.Schema({
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listResults: [{
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
        status: { type: String, enum: ['win', 'lose'], required: true },
        time: { type: Number, min: 0 },
        _id: false
    }]
}, { timestamps: true })

minesweeperSchema.index({ player: 1 })

export default mongoose.model('Minesweeper', minesweeperSchema)