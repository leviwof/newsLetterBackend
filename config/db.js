import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDN connected");
    } catch (error) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;