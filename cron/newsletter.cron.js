import cron from "node-cron";
import Newsletter from "../models/Newsletter.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

cron.schedule("*/1 * * * *", async () => {
    console.log("Checking newsletters...");

    const newsletters = await Newsletter.find();

    for (let news of newsletters) {
        // Simulating new article detection
        const newPost = "https://example.com/new-post";

        if (news.latestPost !== newPost) {
            news.latestPost = newPost;
            await news.save();

            // find subscribers
            const subs = await Subscription.find({
                newsletterId: news._id
            }).populate("userId");

            // send email to all users
            for (let sub of subs) {
                await sendMail(
                    sub.userId.email,
                    `New update from ${news.name}`,
                    `New article published: ${newPost}`
                );
            }

            console.log(`Emails sent for ${news.name}`);
        }
    }
});
