// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { GET } from "@/app/api/emote/route";
import { DELETE } from "@/app/api/emote/[emoteId]/route";
const fetchEmotesApiUrl = "https://api.mock.test/v1/emotes";
const deleteEmoteApiUrl = "https://api.mock.test/v1/emote/a";

const server = setupServer(
    http.get(fetchEmotesApiUrl, () => {
        return HttpResponse.json({
            emotes: [
                {
                    sequenceNumber: 10,
                    emoteId: "a",
                    userName: "A",
                    userId: "@a",
                    emoteDatetime: "2025-01-01T09:00:00.000Z",
                    emoteReactionId: "reaction-a",
                    emoteEmojis: [
                        {
                            emojiId: ":panda:"
                        },
                        {
                            emojiId: ":panda:"
                        },
                        {
                            emojiId: ":panda:"
                        },
                        {
                            emojiId: ":panda:"
                        }
                    ],
                    userAvatarUrl: "https://image.test/a.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":party_parrot:",
                            numberOfReactions: 10,
                            reactedUserIds: ["@a", "@b"]
                        },
                        {
                            emojiId: ":snake:",
                            numberOfReactions: 2,
                            reactedUserIds: ["@c"]
                        }
                    ],
                    totalNumberOfReactions: 10
                },
                {
                    sequenceNumber: 9,
                    emoteId: "b",
                    userName: "B",
                    userId: "@b",
                    emoteDatetime: "2024-01-01T09:12:30.000Z",
                    emoteReactionId: "reaction-b",
                    emoteEmojis: [
                        {
                            emojiId: ":smiling_face:"
                        },
                        {
                            emojiId: ":smiling_face:"
                        },
                        {
                            emojiId: ":smiling_face:"
                        }
                    ],
                    userAvatarUrl: "https://image.test/b.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":snake:",
                            numberOfReactions: 200,
                            reactedUserIds: ["@a"]
                        },
                        {
                            emojiId: ":tiger:",
                            numberOfReactions: 1,
                            reactedUserIds: ["@fuga_fuga"]
                        }
                    ],
                    totalNumberOfReactions: 200
                },
                {
                    sequenceNumber: 8,
                    emoteId: "c",
                    userName: "C",
                    userId: "@c",
                    emoteDatetime: "2023-01-01T09:00:00.000Z",
                    emoteReactionId: "reaction-c",
                    emoteEmojis: [
                        {
                            emojiId: ":bear:"
                        }
                    ],
                    userAvatarUrl: "https://image.test/c.png",
                    emoteReactionEmojis: [],
                    totalNumberOfReactions: 0
                },
                {
                    sequenceNumber: 7,
                    emoteId: "d",
                    userName: "D",
                    userId: "@d",
                    emoteDatetime: "2022-01-01T09:00:00.000Z",
                    emoteReactionId: "reaction-d",
                    emoteEmojis: [
                        {
                            emojiId: ":test:"
                        }
                    ],
                    userAvatarUrl: "https://image.test/d.png",
                    emoteReactionEmojis: [
                        {
                            emojiId: ":test:",
                            numberOfReactions: 0,
                            reactedUserIds: []
                        }
                    ],
                    totalNumberOfReactions: 0
                }
            ]
        });
    }),
    http.delete(deleteEmoteApiUrl, () => {
        return HttpResponse.json({});
    })
);

beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

const getRequestParams = {
    params: new Promise<{ emoteId: string }>((resolve) => {
        resolve({
            emoteId: "a"
        });
    })
};

const fetchEmotes = async (): Promise<NextResponse> => {
    return await GET(new NextRequest(fetchEmotesApiUrl));
};

const deleteEmote = async (): Promise<NextResponse> => {
    return await DELETE(
        new NextRequest(deleteEmoteApiUrl, {
            headers: {
                authorization: "test-token"
            },
            method: "DELETE",
            body: JSON.stringify({ userId: "@a" })
        }),
        getRequestParams
    );
};

describe("GET", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await fetchEmotes();

            expect(response.status).toBe(200);
        });

        test("emotesを返す", async () => {
            const response = await fetchEmotes();
            const data = await response.json();

            expect(data.emotes.length).toBe(4);
        });
    });

    describe("異常系", () => {
        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.get(fetchEmotesApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );
            const response = await fetchEmotes();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("パラメータが不正なとき、400を返す", async () => {
            server.use(
                http.get(fetchEmotesApiUrl, () => {
                    return HttpResponse.json({ error: "EMT-01" }, { status: 400 });
                })
            );
            const response = await fetchEmotes();
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "EMT-01" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.get(fetchEmotesApiUrl, () => {
                    return HttpResponse.json({ error: "EMT-05" }, { status: 500 });
                })
            );

            const response = await fetchEmotes();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "EMT-05" });
        });
    });
});

describe("DELETE", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await deleteEmote();

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.delete(deleteEmoteApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );
            const response = await deleteEmote();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("パラメータが不正なとき、400を返す", async () => {
            server.use(
                http.delete(deleteEmoteApiUrl, () => {
                    return HttpResponse.json({ error: "EMT-01" }, { status: 400 });
                })
            );
            const response = await deleteEmote();
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "EMT-01" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.delete(deleteEmoteApiUrl, () => {
                    return HttpResponse.json({ error: "EMT-05" }, { status: 500 });
                })
            );

            const response = await deleteEmote();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "EMT-05" });
        });
    });
});
