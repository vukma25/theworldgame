import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expireAt: {
        type: Date,
        require: true
    }
}, { timestamps: true });

sessionSchema.index({expireAt: 1}, {expireAfterSeconds: 0});

export default mongoose.model("Session", sessionSchema);


