import mongoose from 'mongoose'

const sudokuSchema =  new mongoose.Schema({
    player: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    listResults: [{
        status: { type: String, enum: ['win', 'lose'], required: true },
        difficulties: {
            type: String, 
            enum: ['Easy', 'Medium', 'Hard', 'Expert'],
            required: true
        },
        size: { type: Number, enum: [4, 9, 16], required: true },
        time: { type: Number, min: 0 },
        mistakes: { type: Number, enum: [0, 1, 2, 3] },
        _id: false
    }]
})

sudokuSchema.index({player: 1})

export default mongoose.model('Sudoku', sudokuSchema)