import mongoose from 'mongoose'

export const isValidObjectId = (id) => {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
};