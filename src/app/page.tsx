import { WebSocketConnectResponse } from "@/@types";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";

export default function Home() {
    const webSocketConnectResponse: WebSocketConnectResponse = {
        emotes: [
            {
                sequenceNumber: 1,
                emoteId: "163d9125-b8f8-4110-ac81-c8342bae93f5",
                userName: "Hoge_hofe",
                userId: "@hoge_hoge",
                emoteDatetime: "",
                emoteReactionId: "",
                emoteEmojis: [
                    {
                        emojiId: ":snake:"
                    }
                ],
                userAvatarUrl: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                emoteReactionEmojis: [
                    {
                        emojiId: ":snake:",
                        numberOfReactions: 23
                    },
                    {
                        emojiId: ":smile:",
                        numberOfReactions: 1
                    },
                    {
                        emojiId: ":bear:",
                        numberOfReactions: 23
                    }
                ]
            }
        ],
        connectionId: "2a00bc5d-7898-418b-96bc-25a8761ebba9"
    };

    return (
        <>
            <PageHeader></PageHeader>
            <WordlessEmotes emotes={webSocketConnectResponse.emotes}></WordlessEmotes>
        </>
    );
}
