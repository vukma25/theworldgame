import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: { type: String },
    avatar: { type: String },
    publicId: { type: String },
    bio: { type: String, maxLength: 500, trim: true },
    socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        x: { type: String },
        other: { type: String }
    },
    googleId: { type: String },
    facebookId: { type: String },
    isVerified: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', _id: false }],
    friendRequests: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        _id: false
    }],
    blackList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', _id: false }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.index({ subUsername: 1 });
userSchema.index({ friends: 1 });

const User = mongoose.model('User', userSchema);
export default User