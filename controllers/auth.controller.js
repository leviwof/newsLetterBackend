import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });

    res.json({ message: "Registered successfully" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secret", {
        expiresIn: "1d"
    });

    res.json({ token });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendMail(
        email,
        "Reset Password",
        `Click here to reset password:\n${resetLink}`
    );

    res.json({ message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
        return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: "Password updated successfully" });
};
