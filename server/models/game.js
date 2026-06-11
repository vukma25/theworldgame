import mongoose from 'mongoose'

const gameScheme = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String, required: true }],
    route: { type: String, required: true }
})

export default mongoose.model("Game", gameScheme)