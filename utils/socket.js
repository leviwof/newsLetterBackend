import { WebSocketServer } from "ws";

export const startSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("User connected");

        ws.on("message", (msg) => {
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(msg.toString());
                }
            })
        })
    })
}