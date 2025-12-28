import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ msg: "No token" });

        const tokenBearer = token.split(" ")[1]
        const decoded = jwt.verify(tokenBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid Token" })
    }
}