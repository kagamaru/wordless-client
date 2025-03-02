import { ws } from "msw";

const websocket = ws.link(process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "");

export const websocketHandlers = [
    websocket.addEventListener("connection", () => {
        console.log("Mock Websocket Server is Connected");
    })
];
