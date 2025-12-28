import express from "express"
import { subscribe, unsubscribe } from "../controllers/newsletter.controller.js"
import { auth } from "../middleware/auth.middleware.js"
import Subscription from "../models/Subscription.js";

const router = express.Router();

router.get("/my-subscription", auth, async (req, res) => {
    const data = await Subscription.find({ userId: req.user.id });
    res.json(data);
});
router.post("/subscribe", auth, subscribe);
router.post("/unsubscribe", auth, unsubscribe);



export default router;