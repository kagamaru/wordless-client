import { EmoteGetAllResponse, EmoteReactionGetResponse } from "@/@types";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";

export default function Home() {
    const wordlessEmotes: EmoteGetAllResponse = [
        {
            emoteId: "a",
            userName: "Hoge",
            userId: "@hoge_hoge",
            emoteDatetime: "2024-12-24 09:00:54",
            emoteReactionId: "aa",
            emoteEmojis: [
                {
                    emojiId: ":snake:"
                },
                {
                    emojiId: ":party_parrot:"
                },
                {
                    emojiId: ":panda:"
                },
                {
                    emojiId: ":lion:"
                }
            ],
            userAvatarUrl: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
            emoteId: "b",
            userName: "Fuga Fuga",
            userId: "@fuga_fuga",
            emoteDatetime: "2023-01-24 12:00:54",
            emoteReactionId: "bb",
            emoteEmojis: [
                {
                    emojiId: ":snake:"
                }
            ],
            userAvatarUrl: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
    ];

    const emoteReactions: EmoteReactionGetResponse = [
        {
            emoteReactionId: "aa",
            emoteReactionEmojis: [
                {
                    emojiId: ":snake:",
                    numberOfReactions: 23
                },
                {
                    emojiId: ":smile:",
                    numberOfReactions: 1
                }
            ]
        },
        {
            emoteReactionId: "bb",
            emoteReactionEmojis: [
                {
                    emojiId: ":party_parrot:",
                    numberOfReactions: 99
                }
            ]
        }
    ];

    return (
        <>
            <PageHeader></PageHeader>
            <WordlessEmotes emotes={wordlessEmotes} emoteReactions={emoteReactions}></WordlessEmotes>
        </>
    );
}
