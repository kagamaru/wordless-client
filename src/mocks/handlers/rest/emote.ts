import { http, HttpResponse } from "msw";

const s3Url = process.env.NEXT_PUBLIC_S3_URL ?? "";

export const emoteHandlers = [
    http.get("http://localhost:3000/api/emote", ({ request }) => {
        const urlSearchParams = new URL(request.url).searchParams;
        if (!urlSearchParams.get("userId") || !urlSearchParams.get("numberOfCompletedAcquisitionsCompleted")) {
            return HttpResponse.json(
                {
                    data: "EMT-01"
                },
                {
                    status: 400
                }
            );
        }

        return HttpResponse.json({
            emotes: urlSearchParams.get("sequenceNumberStartOfSearch")
                ? [
                      {
                          sequenceNumber: 1,
                          emoteId: "z",
                          userName: "ラスト",
                          userId: "@last",
                          emoteDatetime: "2019-01-02T09:00:48.000Z",
                          emoteReactionId: "z",
                          emoteEmojis: [
                              {
                                  emojiId: ":last:"
                              }
                          ],
                          userAvatarUrl: s3Url + "/userProfile/orange.png",
                          emoteReactionEmojis: [
                              {
                                  emojiId: ":last:",
                                  numberOfReactions: 2,
                                  reactedUserIds: ["@last"]
                              }
                          ],
                          totalNumberOfReactions: 2
                      }
                  ]
                : [
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
                          userAvatarUrl: s3Url + "/userProfile/fuga_fuga.png",
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
                          userAvatarUrl: s3Url + "/userProfile/hoge_hoge.png",
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
                          userAvatarUrl: s3Url + "/userProfile/apple.png",
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
                          userAvatarUrl: s3Url + "/userProfile/apple.png",
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
                          userAvatarUrl: s3Url + "/userProfile/apple.png",
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
                          userAvatarUrl: s3Url + "/userProfile/apple.png",
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
                          userAvatarUrl: s3Url + "/userProfile/apple.png",
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
                          userAvatarUrl: s3Url + "/userProfile/orange.png",
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
                          userAvatarUrl: s3Url + "/userProfile/orange.png",
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
                          userAvatarUrl: s3Url + "/userProfile/orange.png",
                          emoteReactionEmojis: [],
                          totalNumberOfReactions: 0
                      }
                  ]
        });
    })
];
