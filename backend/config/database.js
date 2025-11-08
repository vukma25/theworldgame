import mongoose from "mongoose";

const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Mongoose connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB