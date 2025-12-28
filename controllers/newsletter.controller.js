import Newletter from "../models/Newsletter.js"
import Subscription from "../models/Subscription.js"

export const getAllNewsLetters = async (req, res) => {
    const data = await Newletter.find();
    res.json(data);
};

export const subscribe = async (req, res) => {
    try {
        console.log("USER:", req.user);
        console.log("BODY:", req.body);
        const { newsletterId, notifyTime } = req.body;
        if (!newsletterId) {
            return res.status(400).json({ message: "Newsletter ID missing" });
        }

        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const existing = await Subscription.findOne({
            userId: req.user.id,
            newsletterId
        })
        if (existing) {
            return res.status(400).json({
                message: "Already Subscribed"
            })
        }

        await Subscription.create({
            userId: req.user.id,
            newsletterId,
            notifyTime
        });
        res.json({ message: "Subscribed Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Subscription failed" });

    }
}
export const unsubscribe = async (req, res) => {
    try {
        const { newsletterId } = req.body;
        await Subscription.deleteOne({
            userId: req.user.id,
            newsLetterId: newsletterId
        });
        res.json({ message: "Unsubscribed successfully" })
    } catch (err) {
        res.status(500).json({ message: "Unsubscribe failed" })
    }

}