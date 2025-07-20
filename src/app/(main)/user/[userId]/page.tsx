"use client";

import { User } from "@/@types";
import { Emote } from "@/class";
import { FixedFloatingFollowButton, ShadowDivider } from "@/components/atoms";
import { FollowButtonSection, UserProfile, UserSukiSection } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";

export default function UserPage() {
    const userInfo: User = {
        userName: "ユーザー名",
        userId: "@xxxxxxx",
        userAvatarUrl: "/userProfile/user.png"
    };

    const emotes: Emote[] = [
        {
            sequenceNumber: 11,
            emoteId: "dac2faad-0372-4295-9096-532e70b25c94",
            userName:
                "Fuga Fuga あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
            userId: "@fuga_fugaf",
            emoteDatetime: "2025-01-19T09:05:25.000Z",
            emoteReactionId: "f027ab3c-c422-4f98-8446-071f3d9eb78d",
            emoteEmojis: [
                {
                    emojiId: ":neko_meme_banana_cat:"
                },
                {
                    emojiId: ":bear:"
                },
                {
                    emojiId: ":monkey:"
                }
            ],
            userAvatarUrl: "/userProfile/fuga_fuga.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":neko_meme_scream_baby_cat:",
                    numberOfReactions: 100,
                    reactedUserIds: ["@fuga_fuga"]
                }
            ],
            totalNumberOfReactions: 100
        },
        {
            sequenceNumber: 10,
            emoteId: "d9ffafc3-1d0c-4024-8eeb-91ffc723ff0e",
            userName: "Hoge",
            userId: "@hoge_hoge",
            emoteDatetime: "2025-01-19T09:00:48.000Z",
            emoteReactionId: "7c312fe0-1f2e-4b1f-87a1-09eeb3968d74",
            emoteEmojis: [
                {
                    emojiId: ":snake:"
                },
                {
                    emojiId: ":dog:"
                },
                {
                    emojiId: ":dog:"
                },
                {
                    emojiId: ":dog:"
                }
            ],
            userAvatarUrl: "/userProfile/hoge_hoge.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":snake:",
                    numberOfReactions: 200,
                    reactedUserIds: ["@hoge_hoge"]
                },
                {
                    emojiId: ":party_parrot:",
                    numberOfReactions: 100,
                    reactedUserIds: ["@fuga_fuga"]
                },
                {
                    emojiId: ":monkey:",
                    numberOfReactions: 1,
                    reactedUserIds: ["@hoge_hoge"]
                },
                {
                    emojiId: ":dolphin:",
                    numberOfReactions: 1,
                    reactedUserIds: ["@hoge_hoge"]
                },
                {
                    emojiId: ":dog:",
                    numberOfReactions: 1,
                    reactedUserIds: ["@hoge_hoge"]
                },
                {
                    emojiId: ":thank_you:",
                    numberOfReactions: 1,
                    reactedUserIds: ["@hoge_hoge"]
                }
            ],
            totalNumberOfReactions: 300
        },
        {
            sequenceNumber: 9,
            emoteId: "h",
            userName: "りんご",
            userId: "@apple",
            emoteDatetime: "2025-01-08T09:00:48.000Z",
            emoteReactionId: "h",
            emoteEmojis: [
                {
                    emojiId: ":test:"
                },
                {
                    emojiId: ":neko_meme_scream_baby_cat:"
                }
            ],
            userAvatarUrl: "/userProfile/apple.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":melting_face:",
                    numberOfReactions: 8,
                    reactedUserIds: ["@apple"]
                }
            ],
            totalNumberOfReactions: 8
        },
        {
            sequenceNumber: 8,
            emoteId: "g",
            userName: "りんご",
            userId: "@apple",
            emoteDatetime: "2025-01-07T09:00:48.000Z",
            emoteReactionId: "g",
            emoteEmojis: [
                {
                    emojiId: ":dolphin:"
                },
                {
                    emojiId: ":neko_meme_scream_baby_cat:"
                }
            ],
            userAvatarUrl: "/userProfile/apple.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":lion:",
                    numberOfReactions: 7,
                    reactedUserIds: ["@apple"]
                }
            ],
            totalNumberOfReactions: 7
        },
        {
            sequenceNumber: 7,
            emoteId: "f",
            userName: "りんご",
            userId: "@apple",
            emoteDatetime: "2025-01-06T09:00:48.000Z",
            emoteReactionId: "f",
            emoteEmojis: [
                {
                    emojiId: ":bus:"
                }
            ],
            userAvatarUrl: "/userProfile/apple.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":train:",
                    numberOfReactions: 6,
                    reactedUserIds: ["@apple"]
                }
            ],
            totalNumberOfReactions: 6
        },
        {
            sequenceNumber: 6,
            emoteId: "e",
            userName: "りんご",
            userId: "@apple",
            emoteDatetime: "2025-01-05T09:00:48.000Z",
            emoteReactionId: "e",
            emoteEmojis: [
                {
                    emojiId: ":frog:"
                }
            ],
            userAvatarUrl: "/userProfile/apple.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":frog:",
                    numberOfReactions: 5,
                    reactedUserIds: ["@banana"]
                }
            ],
            totalNumberOfReactions: 5
        },
        {
            sequenceNumber: 5,
            emoteId: "d",
            userName: "りんご",
            userId: "@apple",
            emoteDatetime: "2025-01-04T09:00:48.000Z",
            emoteReactionId: "d",
            emoteEmojis: [
                {
                    emojiId: ":you_are_welcome:"
                }
            ],
            userAvatarUrl: "/userProfile/apple.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":you_are_welcome:",
                    numberOfReactions: 4,
                    reactedUserIds: ["@banana"]
                }
            ],
            totalNumberOfReactions: 4
        },
        {
            sequenceNumber: 4,
            emoteId: "c",
            userName: "みかん",
            userId: "@orange",
            emoteDatetime: "2025-01-03T09:00:48.000Z",
            emoteReactionId: "c",
            emoteEmojis: [
                {
                    emojiId: ":ant:"
                }
            ],
            userAvatarUrl: "/userProfile/orange.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":ant:",
                    numberOfReactions: 3,
                    reactedUserIds: ["@banana"]
                }
            ],
            totalNumberOfReactions: 3
        },
        {
            sequenceNumber: 3,
            emoteId: "b",
            userName: "みかん",
            userId: "@orange",
            emoteDatetime: "2025-01-02T09:00:48.000Z",
            emoteReactionId: "b",
            emoteEmojis: [
                {
                    emojiId: ":bear:"
                }
            ],
            userAvatarUrl: "/userProfile/orange.png",
            emoteReactionEmojis: [
                {
                    emojiId: ":happyhappyhappy:",
                    numberOfReactions: 2,
                    reactedUserIds: ["@banana"]
                }
            ],
            totalNumberOfReactions: 2
        },
        {
            sequenceNumber: 2,
            emoteId: "a",
            userName: "みかん",
            userId: "@orange",
            emoteDatetime: "2025-01-01T09:00:48.000Z",
            emoteReactionId: "a",
            emoteEmojis: [
                {
                    emojiId: ":snake:"
                },
                {
                    emojiId: ":dog:"
                }
            ],
            userAvatarUrl: "/userProfile/orange.png",
            emoteReactionEmojis: [],
            totalNumberOfReactions: 0
        }
    ];

    return (
        <>
            <div className="p-4 mt-1">
                <UserProfile userInfo={userInfo} />
                <FollowButtonSection />
                <UserSukiSection userSukiEmojis={[":tiger:", ":snake:", ":hello:", ":ishikawa:"]} />
                <ShadowDivider />
            </div>
            <WordlessEmotes emotes={emotes}></WordlessEmotes>
            <FixedFloatingFollowButton isFollowing={false} />
        </>
    );
}
