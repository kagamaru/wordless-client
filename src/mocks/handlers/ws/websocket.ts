import dayjs from "dayjs";
import { ws } from "msw";
import { Emote } from "@/class";
import envConfigMap from "envConfig";

const websocket = ws.link(envConfigMap.get("NEXT_PUBLIC_WEBSOCKET_URL") ?? "");
const cloudfrontUrl = envConfigMap.get("NEXT_PUBLIC_CLOUDFRONT_URL");
let emoteId = 100;

dayjs.locale("ja");

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
            } else if (data.action === "onPostEmote") {
                const formattedEmoteId = (emoteId++).toString();
                websocket.broadcast(
                    JSON.stringify({
                        action: "onPostEmote",
                        emote: new Emote({
                            sequenceNumber: 11,
                            emoteId: formattedEmoteId,
                            userName: "Hoge_Hoge",
                            userId: data.userId,
                            emoteDatetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            emoteReactionId: "emoteReactionId" + formattedEmoteId,
                            emoteEmojis: [
                                {
                                    emojiId: data.emoteEmoji1
                                },
                                {
                                    emojiId: data.emoteEmoji2
                                },
                                {
                                    emojiId: data.emoteEmoji3
                                },
                                {
                                    emojiId: data.emoteEmoji4
                                }
                            ],
                            userAvatarUrl: cloudfrontUrl + "/userProfile/fuga_fuga.png",
                            emoteReactionEmojis: [],
                            totalNumberOfReactions: 0
                        })
                    })
                );
            }
        });
    })
];
