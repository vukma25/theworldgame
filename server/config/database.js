import mongoose from "mongoose";
import dns from 'dns';

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI, { family: 4 });
        console.log("Mongoose connected");
        console.log(mongoose.connection.host)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB