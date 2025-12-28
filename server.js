import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import http from "http"
import { startSocket } from "./utils/socket.js"
import authRoutes from "./routes/auth.route.js"
import newsletterRoutes from "./routes/newsletter.route.js"
import "./cron/newsletter.cron.js"

console.log("🔥 SERVER FILE LOADED");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
startSocket(server);
server.listen(process.env.PORT, () => {
    console.log("Server running")
})
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/authnew", newsletterRoutes);

app.get("/test", (req, res) => {
    console.log("✅ TEST API HIT");
    res.send("Backend working");
});

app.get("/", (req, res) => {
    res.send("One-sub API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

