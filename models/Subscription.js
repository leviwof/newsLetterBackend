import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    newsletterId: String,
    notifyTime: String
});

export default mongoose.model("Subscription", subscriptionSchema)