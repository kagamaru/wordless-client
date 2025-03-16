import { http, HttpResponse } from "msw";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";
const s3Url = process.env.NEXT_PUBLIC_S3_URL ?? "";

export const emoteHandlers = [
    http.get(restApiUrl + "emotes/", () => {
        return HttpResponse.json({
            emotes: [
                {
                    sequenceNumber: 10,
                    emoteId: "dac2faad-0372-4295-9096-532e70b25c94",
                    userName: "Fuga Fuga",
                    userId: "@fuga_fuga",
                    emoteDatetime: "2025-01-19T09:05:25.000Z",
                    emoteReactionId: "f027ab3c-c422-4f98-8446-071f3d9eb78d",
                    emoteEmojis: [
                        {
                            emojiId: ":bear:"
                        },
                        {
                            emojiId: ":bear:"
                        },
                        {
                            emojiId: ":sad:"
                        },
                        {
                            emojiId: null
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/fuga_fuga.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":party_parrot:",
                            numberOfReactions: 100
                        }
                    ]
                },
                {
                    sequenceNumber: 9,
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
                            emojiId: ":smile:"
                        },
                        {
                            emojiId: ":smile:"
                        },
                        {
                            emojiId: ":party_parrot:"
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/hoge_hoge.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":snake:",
                            numberOfReactions: 200
                        }
                    ]
                },
                {
                    sequenceNumber: 8,
                    emoteId: "h",
                    userName: "りんご",
                    userId: "@apple",
                    emoteDatetime: "2025-01-08T09:00:48.000Z",
                    emoteReactionId: "h",
                    emoteEmojis: [
                        {
                            emojiId: ":bee:"
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/apple.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 8
                        }
                    ]
                },
                {
                    sequenceNumber: 7,
                    emoteId: "g",
                    userName: "りんご",
                    userId: "@apple",
                    emoteDatetime: "2025-01-07T09:00:48.000Z",
                    emoteReactionId: "g",
                    emoteEmojis: [
                        {
                            emojiId: ":bee:"
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/apple.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 7
                        }
                    ]
                },
                {
                    sequenceNumber: 6,
                    emoteId: "f",
                    userName: "りんご",
                    userId: "@apple",
                    emoteDatetime: "2025-01-06T09:00:48.000Z",
                    emoteReactionId: "f",
                    emoteEmojis: [
                        {
                            emojiId: ":bee:"
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/apple.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 6
                        }
                    ]
                },
                {
                    sequenceNumber: 5,
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
                    userAvatarUrl: s3Url + "/userProfile/apple.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 5
                        }
                    ]
                },
                {
                    sequenceNumber: 4,
                    emoteId: "d",
                    userName: "りんご",
                    userId: "@apple",
                    emoteDatetime: "2025-01-04T09:00:48.000Z",
                    emoteReactionId: "d",
                    emoteEmojis: [
                        {
                            emojiId: ":ant:"
                        }
                    ],
                    userAvatarUrl: s3Url + "/userProfile/apple.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 4
                        }
                    ]
                },
                {
                    sequenceNumber: 3,
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
                    userAvatarUrl: s3Url + "/userProfile/orange.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 3
                        }
                    ]
                },
                {
                    sequenceNumber: 2,
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
                    userAvatarUrl: s3Url + "/userProfile/orange.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":smile:",
                            numberOfReactions: 2
                        }
                    ]
                },
                {
                    sequenceNumber: 1,
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
                    userAvatarUrl: s3Url + "/userProfile/orange.png",
                    emoteReactionEmojis: []
                }
            ]
        });
    })
];
