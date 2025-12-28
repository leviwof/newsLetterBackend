import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    name: String,
    sourceUrl: String,
    latestPostUrl: String
});

export default mongoose.model("Newsletter", newsletterSchema);