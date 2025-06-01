import { ws } from "msw";

const websocket = ws.link(process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "");

export const websocketHandlers = [
    websocket.addEventListener("connection", ({ client }) => {
        console.log("Mock Websocket Server is Connected");
        client.addEventListener("message", (message) => {
            const data = JSON.parse(message.data.toString());
            if (data.action === "onReact") {
                websocket.broadcast(
                    JSON.stringify({
                        action: "onReact",
                        emoteReactionId: data.emoteReactionId,
                        emoteReactionEmojis: [
                            {
                                emojiId: data.reactedEmojiId,
                                numberOfReactions: data.operation === "increment" ? 1 : 0,
                                reactedUserIds: data.operation === "increment" ? ["@fuga_fuga"] : []
                            }
                        ],
                        totalNumberOfReactions: data.operation === "increment" ? 1 : 0
                    })
                );
            }
        });
    })
];
