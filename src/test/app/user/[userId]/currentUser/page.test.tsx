// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "../../../vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ReactRequest } from "@/@types";
import UserPage from "@/app/(main)/user/[userId]/page";
import {
    ErrorBoundary,
    PageTemplate,
    ProviderTemplate,
    UserInfoContext,
    WebSocketProvider
} from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockOnReact = vi.fn((_request: ReactRequest) => {});
vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {
            onReact = mockOnReact;
        }
    };
});

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    }),
    useParams: () => ({
        userId: "@x"
    })
}));

const mockFetchEmotes = vi.fn();
const mockDeleteEmote = vi.fn();
const mockFetchUserInfo = vi.fn();
const mockPostUserImage = vi.fn();
let numberOfCompletedAcquisitionsCompleted = "";

// NOTE: 操作者は User X, 表示しているユーザーは User X
const server = setupServer(
    http.get("http://localhost:3000/api/emote", ({ request }) => {
        const urlSearchParams = new URL(request.url).searchParams;
        const sequenceNumberStartOfSearch = urlSearchParams.get("sequenceNumberStartOfSearch");
        numberOfCompletedAcquisitionsCompleted = urlSearchParams.get("numberOfCompletedAcquisitionsCompleted") ?? "";
        mockFetchEmotes();

        return HttpResponse.json({
            emotes: sequenceNumberStartOfSearch
                ? [
                      {
                          sequenceNumber: 16,
                          emoteId: "e",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2021-01-01T09:00:00.000Z",
                          emoteReactionId: "reaction-e",
                          emoteEmojis: [
                              {
                                  emojiId: ":last:"
                              }
                          ],
                          userAvatarUrl: "https://image.test/a.png",
                          emoteReactionEmojis: [
                              {
                                  emojiId: ":tiger:",
                                  numberOfReactions: 2,
                                  reactedUserIds: ["@c"]
                              }
                          ],
                          totalNumberOfReactions: 2
                      },
                      {
                          sequenceNumber: 15,
                          emoteId: "f",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2020-01-01T09:12:30.000Z",
                          emoteReactionId: "reaction-f",
                          emoteEmojis: [
                              {
                                  emojiId: ":smiling_face:"
                              }
                          ],
                          userAvatarUrl: "https://image.test/b.png",
                          emoteReactionEmojis: [
                              {
                                  emojiId: ":tiger:",
                                  numberOfReactions: 1,
                                  reactedUserIds: ["@x"]
                              }
                          ],
                          totalNumberOfReactions: 1
                      },
                      {
                          sequenceNumber: 14,
                          emoteId: "g",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2019-01-01T09:00:00.000Z",
                          emoteReactionId: "reaction-g",
                          emoteEmojis: [
                              {
                                  emojiId: ":rabbit:"
                              }
                          ],
                          userAvatarUrl: "https://image.test/c.png",
                          emoteReactionEmojis: [],
                          totalNumberOfReactions: 0
                      },
                      {
                          sequenceNumber: 13,
                          emoteId: "h",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2018-01-01T09:00:00.000Z",
                          emoteReactionId: "reaction-h",
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
                : [
                      {
                          sequenceNumber: 20,
                          emoteId: "a",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2025-01-01T09:00:00.000Z",
                          emoteReactionId: "reaction-a",
                          emoteEmojis: [
                              {
                                  emojiId: ":rabbit:"
                              },
                              {
                                  emojiId: ":rabbit:"
                              },
                              {
                                  emojiId: ":rabbit:"
                              },
                              {
                                  emojiId: ":rabbit:"
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
                                  emojiId: ":cow:",
                                  numberOfReactions: 2,
                                  reactedUserIds: ["@c"]
                              }
                          ],
                          totalNumberOfReactions: 10
                      },
                      {
                          sequenceNumber: 19,
                          emoteId: "b",
                          userName: "User X",
                          userId: "@x",
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
                                  emojiId: ":cow:",
                                  numberOfReactions: 200,
                                  reactedUserIds: ["@a"]
                              },
                              {
                                  emojiId: ":tiger:",
                                  numberOfReactions: 1,
                                  reactedUserIds: ["@x"]
                              }
                          ],
                          totalNumberOfReactions: 200
                      },
                      {
                          sequenceNumber: 18,
                          emoteId: "c",
                          userName: "User X",
                          userId: "@x",
                          emoteDatetime: "2023-01-01T09:00:00.000Z",
                          emoteReactionId: "reaction-c",
                          emoteEmojis: [
                              {
                                  emojiId: ":rabbit:"
                              }
                          ],
                          userAvatarUrl: "https://image.test/c.png",
                          emoteReactionEmojis: [],
                          totalNumberOfReactions: 0
                      },
                      {
                          sequenceNumber: 17,
                          emoteId: "d",
                          userName: "User X",
                          userId: "@x",
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
    http.delete("http://localhost:3000/api/emote/:emoteId", () => {
        mockDeleteEmote();
        return HttpResponse.json({});
    }),
    http.get("http://localhost:3000/api/user/:userId", ({ params }) => {
        const { userId } = params;
        mockFetchUserInfo();

        switch (userId) {
            case "@a":
                return HttpResponse.json({
                    userId: "@a",
                    userName: "User A",
                    userAvatarUrl: "https://image.test/a.png"
                });
            case "@b":
                return HttpResponse.json({
                    userId: "@b",
                    userName: "User B",
                    userAvatarUrl: "https://image.test/b.png"
                });
            case "@c":
                return HttpResponse.json({
                    userId: "@c",
                    userName: "User C",
                    userAvatarUrl: "https://image.test/c.png"
                });
            case "@x":
                return HttpResponse.json({
                    userId: "@x",
                    userName: "User X",
                    userAvatarUrl: "https://image.test/x.png"
                });
            case "@fuga_fuga":
                return HttpResponse.json({
                    userId: "@fuga_fuga",
                    userName: "User Fuga",
                    userAvatarUrl: "https://image.test/fuga.png"
                });
            default:
                return HttpResponse.json({
                    userId: "@user1",
                    userName: "User One",
                    userAvatarUrl: "https://image.test/user1.png"
                });
        }
    }),
    http.post("http://localhost:3000/api/userImage/:userId", () => {
        mockPostUserImage();
        return HttpResponse.json({});
    }),
    http.get("http://localhost:3000/api/follow/:userId", () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@b", "@c"],
            totalNumberOfFollowees: 20,
            followeeUserIds: ["@b", "@fuga_fuga"]
        });
    }),
    http.post("http://localhost:3000/api/follow/:userId", () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@b", "@c"],
            totalNumberOfFollowees: 21,
            followeeUserIds: ["@b", "@fuga_fuga", "@x"]
        });
    }),
    http.delete("http://localhost:3000/api/follow/:userId", () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@b", "@c"],
            totalNumberOfFollowees: 19,
            followeeUserIds: ["@b"]
        });
    }),
    http.get("http://localhost:3000/api/userSuki/:userId", () => {
        return HttpResponse.json({
            userId: "@x",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
        });
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue("mocked_id_token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
    });
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoContext.Provider
                    value={{
                        userInfo: { userId: "@x", userName: "User X", userAvatarUrl: "https://image.test/x.png" }
                    }}
                >
                    <WebSocketProvider>
                        <PageTemplate>
                            <UserPage />
                        </PageTemplate>
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("操作者のユーザーのページを表示した時", () => {
    describe("初期表示時", () => {
        describe("正常系", () => {
            describe("ユーザー情報表示部分", () => {
                test("ユーザーのプロフィール画像を表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });
                    const userProfileImage = within(userInfoSection).getByAltText("User Xのトッププロフィール画像");

                    await waitFor(() => {
                        expect(userProfileImage).toBeTruthy();
                    });
                });

                test("ユーザープロフィール画像の変更ボタンを表示する", async () => {
                    rendering();
                    const profileImageChangeButton = await screen.findByRole("button", {
                        name: "ユーザー画像変更ボタン"
                    });

                    await waitFor(() => {
                        expect(profileImageChangeButton).toBeTruthy();
                    });
                });

                test("ユーザーの名前を表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });
                    const userName = within(userInfoSection).getByText("User X");

                    await waitFor(() => {
                        expect(userName).toBeTruthy();
                    });
                });

                test("ユーザーの名前を変更するボタンを表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });
                    const userNameChangeButton = within(userInfoSection).getByRole("button", {
                        name: "ユーザー名変更ボタン"
                    });

                    await waitFor(() => {
                        expect(userNameChangeButton).toBeTruthy();
                    });
                });

                test("ユーザーのIDを表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });
                    const userId = within(userInfoSection).getByText("@x");

                    await waitFor(() => {
                        expect(userId).toBeTruthy();
                    });
                });

                test("ユーザーのフォロー数を表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });

                    await waitFor(() => {
                        const displayNumberOfFollowersButton = within(userInfoSection).getByRole("button", {
                            name: "フォロー数を表示"
                        });
                        expect(displayNumberOfFollowersButton).toBeTruthy();
                        expect(within(displayNumberOfFollowersButton).getByText("10")).toBeTruthy();
                    });
                });

                test("ユーザーのフォロワー数を表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });

                    await waitFor(() => {
                        const displayNumberOfFolloweesButton = within(userInfoSection).getByRole("button", {
                            name: "フォロワー数を表示"
                        });
                        expect(displayNumberOfFolloweesButton).toBeTruthy();
                        expect(within(displayNumberOfFolloweesButton).getByText("20")).toBeTruthy();
                    });
                });

                test("ユーザースキ（絵文字）を表示する", async () => {
                    rendering();
                    const userSukiEmoji1 = await screen.findByRole("listitem", { name: "ユーザーが好きなもの：:rat:" });
                    const userSukiEmoji2 = await screen.findByRole("listitem", { name: "ユーザーが好きなもの：:cow:" });
                    const userSukiEmoji3 = await screen.findByRole("listitem", {
                        name: "ユーザーが好きなもの：:tiger:"
                    });
                    const userSukiEmoji4 = await screen.findByRole("listitem", {
                        name: "ユーザーが好きなもの：:rabbit:"
                    });

                    await waitFor(() => {
                        expect(userSukiEmoji1).toBeTruthy();
                        expect(userSukiEmoji2).toBeTruthy();
                        expect(userSukiEmoji3).toBeTruthy();
                        expect(userSukiEmoji4).toBeTruthy();
                    });
                });

                test("ユーザースキを変更するボタンを表示する", async () => {
                    rendering();
                    const userInfoSection = await screen.findByRole("group", { name: "ユーザー情報" });
                    const userSukiChangeButton = within(userInfoSection).getByRole("button", {
                        name: "ユーザースキ変更ボタン"
                    });

                    await waitFor(() => {
                        expect(userSukiChangeButton).toBeTruthy();
                    });
                });
            });

            describe("エモート表示部分", () => {
                test("エモートをサーバから受け取った数表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });

                    await waitFor(() => {
                        expect(within(emoteList).getAllByRole("listitem").length).toBe(4);
                    });
                });

                test("投稿者の名前を表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });

                    await waitFor(() => {
                        expect(within(emoteList).getAllByText("User X").length).toBe(4);
                    });
                });

                test("投稿者のアカウント名を表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });

                    await waitFor(() => {
                        expect(within(emoteList).getAllByText("@x").length).toBe(4);
                    });
                });

                test("投稿日時を表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });

                    await waitFor(() => {
                        expect(within(emoteList).getByText("2025-01-01 18:00:00")).toBeTruthy();
                        expect(within(emoteList).getByText("2024-01-01 18:12:30")).toBeTruthy();
                        expect(within(emoteList).getByText("2023-01-01 18:00:00")).toBeTruthy();
                    });
                });

                test("絵文字を表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
                    const listItemA = within(emoteList).getByRole("listitem", { name: "a" });
                    const listItemB = within(emoteList).getByRole("listitem", { name: "b" });
                    const listItemC = within(emoteList).getByRole("listitem", { name: "c" });
                    const listItemD = within(emoteList).getByRole("listitem", { name: "d" });

                    await waitFor(() => {
                        expect(within(listItemA).getAllByLabelText(":rabbit:").length).toBe(4);
                        expect(within(listItemB).getAllByLabelText(":smiling_face:").length).toBe(3);
                        expect(within(listItemC).getAllByLabelText(":rabbit:").length).toBe(1);
                        expect(within(listItemD).getAllByLabelText(":test:").length).toBe(1);
                    });
                });

                test("投稿者のプロフィール画像を表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
                    const listItemA = within(emoteList).getByRole("listitem", { name: "a" });

                    await waitFor(() => {
                        expect(within(listItemA).getByAltText("User XProfileImage")).toBeTruthy();
                    });
                });

                test("エモート削除ボタンを表示する", async () => {
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
                    const listItemA = within(emoteList).getByRole("listitem", { name: "a" });

                    await waitFor(() => {
                        expect(within(listItemA).getByRole("button", { name: "エモート削除ボタン" })).toBeTruthy();
                    });
                });

                describe("リアクションの総件数を表示する時", () => {
                    test("リアクションの総件数が0件の時、何も表示しない", async () => {
                        rendering();
                        const listItem = await screen.findByRole("listitem", { name: "c" });

                        // NOTE: ＋ボタンが表示される
                        // NOTE: エモート削除ボタンが表示される
                        await waitFor(() => {
                            expect(within(listItem).getAllByRole("button").length).toBe(2);
                        });
                    });

                    test("リアクションの総件数が1件以上の時、リアクション総件数ボタンを表示する", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(screen.getByRole("button", { name: "10 Reactions" })).toBeTruthy();
                            expect(screen.getByRole("button", { name: "200 Reactions" })).toBeTruthy();
                        });
                    });
                });

                describe("リアクションボタンを表示する時", () => {
                    test("リアクションの件数が99件以下の時、そのまま件数を表示する", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(
                                within(screen.getByRole("button", { name: "reaction-a:party_parrot:" })).getByText("10")
                            ).toBeTruthy();
                        });
                    });

                    test("リアクションの件数が99件以上の時、99+を表示する", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(
                                within(screen.getByRole("button", { name: "reaction-b:cow:" })).getByText("99+")
                            ).toBeTruthy();
                        });
                    });

                    test("リアクションが0件の時、リアクションボタンを表示しない", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(screen.queryByRole("button", { name: "reaction-d:test:" })).toBeFalsy();
                        });
                    });

                    test("リアクションがないとき、何も表示しない", async () => {
                        rendering();

                        await waitFor(() => {
                            // NOTE: プラスボタンと削除ボタンで個数は2になる
                            expect(
                                within(screen.getByRole("listitem", { name: "c" })).getAllByRole("button").length
                            ).toBe(2);
                        });
                    });

                    test("ユーザーが既にリアクション済の時、リアクションボタンを「押下済み」の状態にする", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(
                                within(screen.getByRole("listitem", { name: "b" })).getByRole("button", {
                                    name: "reaction-b:tiger:",
                                    pressed: true
                                })
                            ).toBeTruthy();
                        });
                    });

                    test("ユーザーがリアクション済みでない時、リアクションボタンを「押下済み」の状態にしない", async () => {
                        rendering();

                        await waitFor(() => {
                            expect(
                                within(screen.getByRole("listitem", { name: "a" })).getByRole("button", {
                                    name: "reaction-a:party_parrot:",
                                    pressed: false
                                })
                            ).toBeTruthy();
                        });
                    });
                });

                test("もっと見るボタンを表示する", async () => {
                    rendering();

                    await waitFor(() => {
                        expect(screen.getByRole("button", { name: "search もっと見る" })).toBeTruthy();
                    });
                });

                test("ローディングスピナーを表示する", async () => {
                    rendering();

                    await waitFor(() => {
                        expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
                    });
                });
            });
        });

        describe("異常系", () => {
            describe.each([
                ["EMT-01", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-02", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-03", "接続できません。もう一度やり直してください。"],
                ["EMT-04", "接続できません。もう一度やり直してください。"],
                ["EMT-05", "接続できません。もう一度やり直してください。"]
            ])("サーバから%sエラーが返却された時", (errorCode, errorMessage) => {
                beforeEach(() => {
                    server.use(
                        http.get("http://localhost:3000/api/emote", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );
                    rendering();
                });

                test(`エラーメッセージ「${errorMessage}」を表示する`, async () => {
                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                });

                test("もっと見るボタンを表示しない", async () => {
                    await waitFor(() => {
                        expect(screen.queryByRole("button", { name: "search もっと見る" })).toBeFalsy();
                    });
                });

                test("「最後のエモートです」を表示しない", async () => {
                    await waitFor(() => {
                        expect(screen.queryByText("最後のエモートです")).toBeFalsy();
                    });
                });
            });

            test.each([
                ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "ユーザー情報取得APIに%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    server.use(
                        http.get("http://localhost:3000/api/user/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );

                    rendering();

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );

            test.each([
                ["USK-01", "不正なリクエストです。もう一度やり直してください。"],
                ["USK-02", "不正なリクエストです。もう一度やり直してください。"],
                ["USK-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "ユーザースキ取得APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    server.use(
                        http.get("http://localhost:3000/api/userSuki/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );

                    rendering();

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );

            test.each([
                ["FOL-01", "不正なリクエストです。もう一度やり直してください。"],
                ["FOL-02", "不正なリクエストです。もう一度やり直してください。"],
                ["FOL-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "フォロワー取得APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    server.use(
                        http.get("http://localhost:3000/api/follow/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );

                    rendering();

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );
        });
    });

    describe("ユーザー画像編集ボタンを押下した時、", () => {
        async function uploadImage() {
            const fileInput = screen.getByTestId("file-input");
            const file = new File(["test"], "test.png", { type: "image/png" });
            await user.upload(fileInput, file);
        }

        describe("正常系", () => {
            beforeEach(async () => {
                rendering();
            });

            test("ローディングアイコンを表示する", async () => {
                server.use(
                    http.post("http://localhost:3000/api/userImage/:userId", () => {
                        return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                    })
                );
                await user.click(await screen.findByRole("button", { name: "ユーザー画像変更ボタン" }));
                await uploadImage();

                await waitFor(() => {
                    expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
                });
            });

            test("ユーザー画像登録APIが呼ばれる", async () => {
                await user.click(await screen.findByRole("button", { name: "ユーザー画像変更ボタン" }));
                await uploadImage();

                expect(mockPostUserImage).toHaveBeenCalled();
            });

            test("エモート-取得APIが呼ばれる", async () => {
                await user.click(await screen.findByRole("button", { name: "ユーザー画像変更ボタン" }));
                await uploadImage();

                expect(mockFetchEmotes).toHaveBeenCalled();
            });

            test("ユーザー情報取得APIが呼ばれる", async () => {
                await user.click(await screen.findByRole("button", { name: "ユーザー画像変更ボタン" }));
                await uploadImage();

                expect(mockFetchUserInfo).toHaveBeenCalled();
            });
        });

        describe("異常系", () => {
            test.each([
                ["IMG-01", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-02", "サンプルユーザーはプロフィール画像を変えることが出来ません。"],
                ["IMG-03", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-04", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-05", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-06", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
                ["IMG-07", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-08", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
                ["IMG-09", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
                ["IMG-91", "不正なリクエストです。もう一度やり直してください。"],
                ["IMG-92", "サンプルユーザーはプロフィール画像を変えることが出来ません。"],
                ["IMG-93", "画像データがありません。"],
                ["IMG-94", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "ユーザー画像登録APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    server.use(
                        http.post("http://localhost:3000/api/userImage/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );
                    rendering();

                    await user.click(await screen.findByRole("button", { name: "ユーザー画像変更ボタン" }));
                    await uploadImage();

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );
        });
    });

    test("ユーザースキ編集ボタンをクリックした時、ユーザースキ登録画面に遷移する", async () => {
        rendering();

        await user.click(await screen.findByRole("button", { name: "ユーザースキ変更ボタン" }));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x/registration/usersuki");
        });
    });

    test("ユーザー名変更ボタンをクリックした時、ユーザー名変更画面に遷移する", async () => {
        rendering();

        await user.click(await screen.findByRole("button", { name: "ユーザー名変更ボタン" }));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x/registration/userName");
        });
    });

    describe("エモート削除ボタンをクリックした時", () => {
        test("エモート削除確認ダイアログを表示する", async () => {
            rendering();
            const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
            const listItemA = within(emoteList).getByRole("listitem", { name: "a" });
            await user.click(within(listItemA).getByRole("button", { name: "エモート削除ボタン" }));

            await waitFor(() => {
                expect(screen.getByRole("dialog")).toBeTruthy();
            });
        });
    });

    describe("エモート削除確認ダイアログ表示時", () => {
        describe("正常系", () => {
            beforeEach(async () => {
                rendering();
                const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
                const listItemA = within(emoteList).getByRole("listitem", { name: "a" });
                await user.click(within(listItemA).getByRole("button", { name: "エモート削除ボタン" }));
            });

            test("エモート削除ボタンをクリックした時、ローディングアイコンを表示する", async () => {
                server.use(
                    http.delete("http://localhost:3000/api/emote/:emoteId", () => {
                        // NOTE: 永続的にローディング状態を維持
                        return new Promise(() => {});
                    })
                );
                await user.click(await screen.findByRole("button", { name: "削除する" }));

                await waitFor(() => {
                    expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
                });
            });

            test("エモート削除ボタンをクリックした時、エモートが削除される", async () => {
                await user.click(await screen.findByRole("button", { name: "削除する" }));

                await waitFor(() => {
                    expect(mockDeleteEmote).toHaveBeenCalled();
                });
            });

            test("×ボタンをクリックした時、エモート削除確認ダイアログが閉じられる", async () => {
                await user.click(await screen.findByRole("button", { name: "Close" }));

                await waitFor(() => {
                    expect(screen.queryByRole("dialog")).toBeFalsy();
                });
            });

            test("キャンセルボタンを押下した時、エモート削除確認ダイアログが閉じられる", async () => {
                await user.click(await screen.findByRole("button", { name: "キャンセル" }));

                await waitFor(() => {
                    expect(screen.queryByRole("dialog")).toBeFalsy();
                });
            });
        });

        describe("異常系", () => {
            test.each([
                ["EMT-11", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-12", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-13", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-14", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-15", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
                ["EMT-16", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "エモート削除APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    server.use(
                        http.delete("http://localhost:3000/api/emote/:emoteId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );
                    rendering();
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });
                    const listItemA = within(emoteList).getByRole("listitem", { name: "a" });
                    await user.click(within(listItemA).getByRole("button", { name: "エモート削除ボタン" }));

                    await user.click(await screen.findByRole("button", { name: "削除する" }));

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );
        });
    });

    describe("リアクション総数ボタンをクリックした時", () => {
        describe("正常系", () => {
            beforeEach(async () => {
                rendering();

                await user.click(await screen.findByRole("button", { name: "10 Reactions" }));
            });

            test("リアクションユーザー一覧のモーダルが表示される", async () => {
                await waitFor(() => {
                    expect(screen.getByRole("dialog")).toBeTruthy();
                });
            });

            describe("リアクションユーザー一覧モーダル表示時", () => {
                test("リアクションしたユーザーの名前が表示される", async () => {
                    await waitFor(() => {
                        expect(
                            within(screen.getByRole("link", { name: "User A @a" })).getByText("User A")
                        ).toBeTruthy();
                        expect(
                            within(screen.getByRole("link", { name: "User B @b" })).getByText("User B")
                        ).toBeTruthy();
                        expect(
                            within(screen.getByRole("link", { name: "User C @c" })).getByText("User C")
                        ).toBeTruthy();
                    });
                });

                test("リアクションしたユーザーのユーザーIDが表示される", async () => {
                    await waitFor(() => {
                        expect(within(screen.getByRole("link", { name: "User A @a" })).getByText("@a")).toBeTruthy();
                        expect(within(screen.getByRole("link", { name: "User B @b" })).getByText("@b")).toBeTruthy();
                        expect(within(screen.getByRole("link", { name: "User C @c" })).getByText("@c")).toBeTruthy();
                    });
                });

                // TODO; リアクションしたユーザーのプロフィール画像クリック時、画面遷移するテストを作成する

                test("×ボタンクリック時、モーダルが閉じられる", async () => {
                    await user.click(await screen.findByRole("button", { name: "close" }));

                    await waitFor(() => {
                        expect(screen.queryByRole("dialog")).toBeFalsy();
                    });
                });
            });
        });

        describe("異常系", () => {
            test("ユーザー情報取得APIに全て失敗した時、「ユーザー情報の取得に失敗しました。」と表示する", async () => {
                server.use(
                    http.get("http://localhost:3000/api/user/:userId", () => {
                        return HttpResponse.json({ data: "USE-01" }, { status: 400 });
                    })
                );

                rendering();
                await user.click(await screen.findByRole("button", { name: "10 Reactions" }));

                await waitFor(() => {
                    expect(
                        within(screen.getByRole("dialog")).getByText("ユーザー情報の取得に失敗しました。")
                    ).toBeTruthy();
                });
            });

            test("ユーザー情報取得APIに一部失敗した時、「情報を取得できなかったユーザーがいます。」と表示する", async () => {
                server.use(
                    http.get("http://localhost:3000/api/user/@a", () => {
                        return HttpResponse.json({ data: "USE-02" }, { status: 400 });
                    })
                );

                rendering();
                await user.click(await screen.findByRole("button", { name: "10 Reactions" }));

                await waitFor(() => {
                    expect(
                        within(screen.getByRole("dialog")).getByText("情報を取得できなかったユーザーがいます。")
                    ).toBeTruthy();
                });
            });
        });
    });

    describe("フォロー数ボタンをクリックした時", () => {
        describe("正常系", () => {
            describe("フォロー数が1人以上の時", () => {
                beforeEach(async () => {
                    rendering();
                });

                test("ユーザー一覧Drawerが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByRole("dialog")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザー名が表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByText("User B")).toBeTruthy();
                        expect(within(drawer).getByText("User C")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザーIDが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByText("@b")).toBeTruthy();
                        expect(within(drawer).getByText("@c")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザーアバターが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByAltText("User Bのプロフィール画像")).toBeTruthy();
                        expect(within(drawer).getByAltText("User Cのプロフィール画像")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にローディングアイコンが表示される", async () => {
                    server.use(
                        http.get("http://localhost:3000/api/user/:userId", () => {
                            return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
                    });
                });
            });

            describe("フォロー数が0人の時", () => {
                test("ユーザー一覧Drawer内に「フォロー中のユーザーがいません」と表示される", async () => {
                    server.use(
                        http.get("http://localhost:3000/api/follow/:userId", () => {
                            return HttpResponse.json({
                                totalNumberOfFollowing: 0,
                                followingUserIds: [],
                                totalNumberOfFollowees: 20,
                                followeeUserIds: ["@b", "@fuga_fuga"]
                            });
                        })
                    );
                    rendering();

                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByText("フォロー中のユーザーがいません")).toBeTruthy();
                    });
                });
            });
        });

        describe("異常系", () => {
            test.each([
                ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "ユーザー情報取得APIに%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    rendering();
                    server.use(
                        http.get("http://localhost:3000/api/user/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));
                    const drawer = screen.getByRole("dialog");

                    await waitFor(() => {
                        const alertComponent = within(drawer).getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );
        });
    });

    describe("フォロワー数ボタンをクリックした時", () => {
        describe("正常系", () => {
            describe("フォロワー数が1人以上の時", () => {
                beforeEach(async () => {
                    rendering();
                });

                test("ユーザー一覧Drawerが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByRole("dialog")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザー名が表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByText("User B")).toBeTruthy();
                        expect(within(drawer).getByText("User Fuga")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザーIDが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByText("@b")).toBeTruthy();
                        expect(within(drawer).getByText("@fuga_fuga")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にユーザーアバターが表示される", async () => {
                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));

                    await waitFor(() => {
                        const drawer = screen.getByRole("dialog");
                        expect(within(drawer).getByAltText("User Bのプロフィール画像")).toBeTruthy();
                        expect(within(drawer).getByAltText("User Fugaのプロフィール画像")).toBeTruthy();
                    });
                });

                test("ユーザー一覧Drawer内にローディングアイコンが表示される", async () => {
                    server.use(
                        http.get("http://localhost:3000/api/user/:userId", () => {
                            return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "フォロー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
                    });
                });
            });

            describe("フォロワー数が0人の時", () => {
                test("ユーザー一覧Drawer内に「フォロワーがいません」と表示する", async () => {
                    server.use(
                        http.get("http://localhost:3000/api/follow/:userId", () => {
                            return HttpResponse.json({
                                totalNumberOfFollowing: 10,
                                followingUserIds: ["@b", "@c"],
                                totalNumberOfFollowees: 0,
                                followeeUserIds: []
                            });
                        })
                    );
                    rendering();

                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));

                    await waitFor(() => {
                        expect(screen.getByText("フォロワーがいません")).toBeTruthy();
                    });
                });
            });
        });

        describe("異常系", () => {
            test.each([
                ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
                ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
            ])(
                "ユーザー情報取得APIに%sエラーが返却された時、エラーメッセージ「%s」を表示する",
                async (errorCode, errorMessage) => {
                    rendering();
                    server.use(
                        http.get("http://localhost:3000/api/user/:userId", () => {
                            return HttpResponse.json({ data: errorCode }, { status: 400 });
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "フォロワー数を表示" }));
                    const drawer = screen.getByRole("dialog");

                    await waitFor(() => {
                        const alertComponent = within(drawer).getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                }
            );
        });
    });

    describe("リアクションボタンをクリックした時", () => {
        describe("正常系", () => {
            describe("未リアクションのリアクションボタンをクリックした時", () => {
                test("絵文字リアクションAPIがincrement操作で呼び出される", async () => {
                    rendering();

                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "a" })).findByRole("button", {
                            name: "reaction-a:party_parrot:"
                        })
                    );

                    await waitFor(() => {
                        expect(mockOnReact).toHaveBeenCalledWith({
                            emoteReactionId: "reaction-a",
                            reactedEmojiId: ":party_parrot:",
                            reactedUserId: "@x",
                            operation: "increment",
                            Authorization: "mocked_id_token"
                        });
                    });
                });

                // NOTE: WebSocketの内部ロジックのmock化が困難
                test.todo("リアクションボタンをクリックした時、リアクションボタンの表示が更新される");

                test("「もっと見る」を押下せずにクリックした時、取得件数10件でエモート-取得がよばれる", async () => {
                    rendering();
                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "a" })).findByRole("button", {
                            name: "reaction-a:party_parrot:"
                        })
                    );

                    await waitFor(() => {
                        // NOTE: 初回呼び出し + リアクションボタンクリック時
                        expect(mockFetchEmotes).toHaveBeenCalledTimes(2);
                        // NOTE: 初回呼び出し時のエモート数は4件
                        expect(numberOfCompletedAcquisitionsCompleted).toBe("4");
                    });
                });

                test("「もっと見る」を押下した上でクリックした時、その時のエモートの取得件数でエモート-取得がよばれる", async () => {
                    rendering();
                    await user.click(await screen.findByRole("button", { name: "search もっと見る" }));
                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "e" })).findByRole("button", {
                            name: "reaction-e:tiger:"
                        })
                    );

                    await waitFor(() => {
                        // NOTE: 初回呼び出し + 「もっと見る」押下時 + リアクションボタンクリック時
                        expect(mockFetchEmotes).toHaveBeenCalledTimes(3);
                        // NOTE: 初回呼び出し時のエモート数は4件 + 「もっと見る」押下時のエモート数は4件
                        expect(numberOfCompletedAcquisitionsCompleted).toBe("8");
                    });
                });
            });

            describe("既にリアクション済のリアクションボタンをクリックした時", () => {
                test("絵文字リアクションAPIがdecrement操作で呼び出される", async () => {
                    rendering();

                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "b" })).findByRole("button", {
                            name: "reaction-b:tiger:"
                        })
                    );

                    await waitFor(() => {
                        expect(mockOnReact).toHaveBeenCalledWith({
                            emoteReactionId: "reaction-b",
                            reactedEmojiId: ":tiger:",
                            reactedUserId: "@x",
                            operation: "decrement",
                            Authorization: "mocked_id_token"
                        });
                    });
                });

                // NOTE: WebSocketの内部ロジックのmock化が困難
                test.todo("リアクションボタンをクリックした時、リアクションボタンの表示が更新される");

                test("「もっと見る」を押下せずにクリックした時、取得件数10件でエモート-取得がよばれる", async () => {
                    rendering();
                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "b" })).findByRole("button", {
                            name: "reaction-b:tiger:"
                        })
                    );

                    await waitFor(() => {
                        // NOTE: 初回呼び出し + リアクションボタンクリック時
                        expect(mockFetchEmotes).toHaveBeenCalledTimes(2);
                        // NOTE: 初回呼び出し時のエモート数は4件
                        expect(numberOfCompletedAcquisitionsCompleted).toBe("4");
                    });
                });

                test("「もっと見る」を押下した上でクリックした時、その時のエモートの取得件数でエモート-取得がよばれる", async () => {
                    rendering();
                    await user.click(await screen.findByRole("button", { name: "search もっと見る" }));
                    await user.click(
                        await within(await screen.findByRole("listitem", { name: "f" })).findByRole("button", {
                            name: "reaction-f:tiger:"
                        })
                    );

                    await waitFor(() => {
                        // NOTE: 初回呼び出し + 「もっと見る」押下時 + リアクションボタンクリック時
                        expect(mockFetchEmotes).toHaveBeenCalledTimes(3);
                        // NOTE: 初回呼び出し時のエモート数は4件 + 「もっと見る」押下時のエモート数は4件
                        expect(numberOfCompletedAcquisitionsCompleted).toBe("8");
                    });
                });
            });
        });
    });

    test("ユーザー名をクリックした時、ユーザーページに遷移する", async () => {
        rendering();

        await user.click(within(await screen.findByRole("listitem", { name: "a" })).getByText("User X"));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x");
        });
    });

    test("ユーザーIDをクリックした時、ユーザーページに遷移する", async () => {
        rendering();

        await user.click(within(await screen.findByRole("listitem", { name: "a" })).getByText("@x"));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x");
        });
    });

    test("ユーザーアバターをクリックした時、ユーザーページに遷移する", async () => {
        rendering();

        await user.click(within(await screen.findByRole("listitem", { name: "a" })).getByAltText("User XProfileImage"));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x");
        });
    });

    describe("リアクション追加ボタンをクリックした時", () => {
        describe("正常系", () => {
            test("リアクション追加ボタンをクリックした時、リアクション追加モーダルが表示される", async () => {
                rendering();

                const listItem = await screen.findByRole("listitem", { name: "b" });
                const plusButton = within(listItem).getByRole("button", { name: "+" });
                await user.click(plusButton);

                await waitFor(() => {
                    expect(screen.getByRole("dialog")).toBeTruthy();
                });
            });

            describe("リアクション追加モーダル表示時", () => {
                beforeEach(async () => {
                    rendering();

                    const listItem = await screen.findByRole("listitem", { name: "b" });
                    const plusButton = within(listItem).getByRole("button", { name: "+" });
                    await user.click(plusButton);

                    // NOTE: モーダル表示確認（失敗を防ぐ）
                    await waitFor(() => {
                        expect(screen.getByRole("dialog")).toBeTruthy();
                    });
                });

                test("「プリセット」の絵文字が表示される", async () => {
                    await waitFor(() => {
                        expect(screen.getByRole("tab", { name: "プリセット", selected: true })).toBeTruthy();
                    });
                });

                test("絵文字検索テキストボックス入力時に英語入力時、検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "rat");

                    const emojiReactionDialog = screen.getByRole("dialog");
                    await waitFor(() => {
                        expect(within(emojiReactionDialog).getByText("🐀")).toBeTruthy();
                        // NOTE: 「🐀」以外の絵文字が表示されていないことを検証
                        expect(within(emojiReactionDialog).queryByText("🐄")).toBeFalsy();
                    });
                });

                test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "ラット");

                    const emojiReactionDialog = screen.getByRole("dialog");
                    await waitFor(() => {
                        expect(within(emojiReactionDialog).getByText("🐀")).toBeTruthy();
                        // NOTE: 「🐀」以外の絵文字が表示されていないことを検証
                        expect(within(emojiReactionDialog).queryByText("🐄")).toBeFalsy();
                    });
                });

                test("絵文字検索テキストボックスに入力後、「カスタム」タブを選択した時、「カスタム」での検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "last");
                    await user.click(screen.getByRole("tab", { name: "カスタム", selected: false }));

                    await waitFor(() => {
                        const lastEmojiImage = screen.getByRole("button", { name: ":last:" });
                        expect(lastEmojiImage).toBeTruthy();
                    });
                });

                test("絵文字検索テキストボックスに入力後、「ミーム」タブを選択した時、「ミーム」での検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");
                    await user.click(screen.getByRole("tab", { name: "ミーム", selected: false }));

                    await waitFor(() => {
                        const nekoMemeSurpriseCatImage = screen.getByRole("button", {
                            name: ":neko_meme_surprising_cat:"
                        });
                        expect(nekoMemeSurpriseCatImage).toBeTruthy();
                    });
                });

                describe("「カスタム」タブ選択時、", () => {
                    beforeEach(async () => {
                        await user.click(screen.getByRole("tab", { name: "カスタム", selected: false }));
                    });

                    test("「カスタム」タブが選択される", async () => {
                        await waitFor(() => {
                            expect(screen.getByRole("tab", { name: "カスタム", selected: true })).toBeTruthy();
                        });
                    });

                    test("絵文字検索テキストボックス入力時に英語入力時、検索結果が表示される", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "last");

                        await waitFor(() => {
                            const lastEmojiImage = screen.getByRole("button", { name: ":last:" });
                            expect(lastEmojiImage).toBeTruthy();
                            // NOTE: 「ラスト」以外の絵文字が表示されていないことを検証
                            expect(screen.queryByRole("button", { name: ":hello:" })).toBeFalsy();
                        });
                    });

                    test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "ラスト");

                        await waitFor(() => {
                            const lastEmojiImage = screen.getByRole("button", { name: ":last:" });
                            expect(lastEmojiImage).toBeTruthy();
                            // NOTE: 「ラスト」以外の絵文字が表示されていないことを検証
                            expect(screen.queryByRole("button", { name: ":hello:" })).toBeFalsy();
                        });
                    });
                });

                describe("「ミーム」タブ選択時、", () => {
                    beforeEach(async () => {
                        await user.click(screen.getByRole("tab", { name: "ミーム", selected: false }));
                    });

                    test("「ミーム」タブが選択される", async () => {
                        await waitFor(() => {
                            expect(screen.getByRole("tab", { name: "ミーム", selected: true })).toBeTruthy();
                        });
                    });

                    test("絵文字検索テキストボックス入力時に英語入力時、検索結果が表示される", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "surprising");

                        await waitFor(() => {
                            const nekoMemeSurpriseCatImage = screen.getByRole("button", {
                                name: ":neko_meme_surprising_cat:"
                            });
                            expect(nekoMemeSurpriseCatImage).toBeTruthy();
                            // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                            expect(screen.queryByRole("button", { name: ":neko_meme_crying_cat:" })).toBeFalsy();
                        });
                    });

                    test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");

                        await waitFor(() => {
                            const nekoMemeSurpriseCatImage = screen.getByRole("button", {
                                name: ":neko_meme_surprising_cat:"
                            });
                            expect(nekoMemeSurpriseCatImage).toBeTruthy();
                            // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                            expect(screen.queryByRole("button", { name: ":neko_meme_crying_cat:" })).toBeFalsy();
                        });
                    });
                });

                test("「カスタム」タブ選択後、「プリセット」タブを選択すると、「プリセット」のタブが表示される", async () => {
                    await user.click(screen.getByRole("tab", { name: "カスタム", selected: false }));
                    await user.click(screen.getByRole("tab", { name: "プリセット", selected: false }));

                    await waitFor(() => {
                        expect(screen.getByRole("tab", { name: "プリセット", selected: true })).toBeTruthy();
                    });
                });

                describe("絵文字検索テキストボックスの×ボタン押下時", () => {
                    test("絵文字検索テキストボックスの内容がクリアされる", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "snake");
                        await user.click(screen.getByRole("button", { name: "close-circle" }));

                        await waitFor(() => {
                            expect(screen.getByPlaceholderText("絵文字を検索...").innerText).toBeFalsy();
                        });
                    });

                    test("検索結果がクリアされる", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "rat");
                        const emojiReactionDialog = screen.getByRole("dialog");
                        await waitFor(() => {
                            // NOTE: 検索結果として表示されていることを検証
                            expect(within(emojiReactionDialog).getByText("🐀")).toBeTruthy();
                            // NOTE: 検索結果として表示されていないことを検証
                            expect(within(emojiReactionDialog).queryByText("🐄")).toBeFalsy();
                        });

                        await user.click(screen.getByRole("button", { name: "close-circle" }));

                        await waitFor(() => {
                            // NOTE: 絵文字の種類に関係なく表示されることを確認
                            expect(within(emojiReactionDialog).getByText("🐀")).toBeTruthy();
                            expect(within(emojiReactionDialog).getByText("🐄")).toBeTruthy();
                        });
                    });
                });

                describe("リアクション追加ボタンをクリックした時", () => {
                    test("未リアクションの絵文字をクリックした時、絵文字リアクションAPIがincrement操作で呼び出される", async () => {
                        await user.click(within(screen.getByRole("dialog")).getByText("🐀"));

                        await waitFor(() => {
                            expect(mockOnReact).toHaveBeenCalledWith({
                                emoteReactionId: "reaction-b",
                                reactedEmojiId: ":rat:",
                                reactedUserId: "@x",
                                operation: "increment",
                                Authorization: "mocked_id_token"
                            });
                        });
                    });

                    test("既にリアクション済の絵文字をクリックした時、絵文字リアクションAPIがdecrement操作で呼び出される", async () => {
                        await user.click(within(screen.getByRole("dialog")).getByText("🐅"));

                        await waitFor(() => {
                            expect(mockOnReact).toHaveBeenCalledWith({
                                emoteReactionId: "reaction-b",
                                reactedEmojiId: ":tiger:",
                                reactedUserId: "@x",
                                operation: "decrement",
                                Authorization: "mocked_id_token"
                            });
                        });
                    });

                    test("リアクション追加ボタンをクリックした時、リアクション追加モーダルが閉じられる", async () => {
                        await user.click(within(screen.getByRole("dialog")).getByText("🐅"));

                        await waitFor(() => {
                            expect(screen.queryByRole("dialog")).toBeFalsy();
                        });
                    });
                });

                test("×ボタンクリック時、モーダルが閉じられる", async () => {
                    const dialog = screen.getByRole("dialog");
                    const closeButton = within(dialog).getByRole("button", { name: "close" });
                    await user.click(closeButton);

                    await waitFor(() => {
                        expect(screen.queryByRole("dialog")).toBeNull();
                    });
                });

                describe("再表示時", () => {
                    test("検索テキストボックスの内容が初期化される", async () => {
                        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "snake");
                        await user.click(screen.getByRole("button", { name: "close" }));

                        await user.click(
                            within(await screen.findByRole("listitem", { name: "b" })).getByRole("button", {
                                name: "+"
                            })
                        );

                        await waitFor(() => {
                            expect(screen.getByPlaceholderText("絵文字を検索...").innerText).toBeFalsy();
                        });
                    });

                    test("タブが「プリセット」に初期化される", async () => {
                        await user.click(screen.getByRole("tab", { name: "カスタム", selected: false }));
                        await user.click(screen.getByRole("button", { name: "close" }));

                        await user.click(
                            within(await screen.findByRole("listitem", { name: "b" })).getByRole("button", {
                                name: "+"
                            })
                        );

                        await waitFor(() => {
                            expect(screen.getByRole("tab", { name: "プリセット", selected: true })).toBeTruthy();
                        });
                    });
                });
            });

            test("「もっと見る」を押下せずにリアクション追加した時、取得件数10件でエモート-取得がよばれる", async () => {
                rendering();
                const listItem = await screen.findByRole("listitem", { name: "b" });
                const plusButton = within(listItem).getByRole("button", { name: "+" });
                await user.click(plusButton);

                await user.click(within(screen.getByRole("dialog")).getByText("🐀"));

                await waitFor(() => {
                    expect(mockFetchEmotes).toHaveBeenCalledTimes(2);
                    expect(numberOfCompletedAcquisitionsCompleted).toBe("4");
                });
            });

            test("「もっと見る」を押下した上でリアクション追加した時、その時のエモートの取得件数でエモート-取得がよばれる", async () => {
                rendering();
                await user.click(await screen.findByRole("button", { name: "search もっと見る" }));
                const listItem = await screen.findByRole("listitem", { name: "h" });
                const plusButton = within(listItem).getByRole("button", { name: "+" });
                await user.click(plusButton);

                await user.click(within(screen.getByRole("dialog")).getByText("🐀"));

                await waitFor(() => {
                    expect(mockFetchEmotes).toHaveBeenCalledTimes(3);
                    expect(numberOfCompletedAcquisitionsCompleted).toBe("8");
                });
            });
        });
    });

    describe("もっと見るボタンをクリックした時", () => {
        test("エモートを取得中、ボタンにローディングが表示される", async () => {
            rendering();
            server.use(
                http.get("http://localhost:3000/api/emote", () => {
                    return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                })
            );

            await user.click(await screen.findByRole("button", { name: "search もっと見る" }));

            await waitFor(() => {
                expect(screen.getByRole("button", { name: "loading もっと見る" })).toBeTruthy();
            });
        });

        describe("エモート取得成功時", () => {
            describe("取得したエモートが1件以上だった時", () => {
                beforeEach(async () => {
                    rendering();
                    await user.click(await screen.findByRole("button", { name: "search もっと見る" }));
                });

                test("取得したエモートを表示する", async () => {
                    const emoteList = await screen.findByRole("list", { name: "エモート一覧" });

                    await waitFor(() => {
                        expect(within(emoteList).getAllByRole("listitem").length).toBe(8);
                    });
                });

                test("引き続きエモート取得ボタンを表示する", async () => {
                    await waitFor(() => {
                        expect(screen.getByRole("button", { name: "search もっと見る" })).toBeTruthy();
                    });
                });
            });

            describe("取得したエモートが0件だった時", () => {
                beforeEach(async () => {
                    rendering();
                    server.use(
                        http.get("http://localhost:3000/api/emote", () => {
                            return HttpResponse.json({
                                emotes: []
                            });
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "search もっと見る" }));
                });

                test("「最後のエモートです」を表示する", async () => {
                    await waitFor(() => {
                        expect(screen.getByText("最後のエモートです")).toBeTruthy();
                    });
                });

                test("エモート取得ボタンを表示しない", async () => {
                    await waitFor(() => {
                        expect(screen.queryByRole("button", { name: "search もっと見る" })).toBeFalsy();
                    });
                });
            });
        });

        describe("エモート取得失敗時", () => {
            describe.each([
                ["EMT-01", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-02", "不正なリクエストです。もう一度やり直してください。"],
                ["EMT-03", "接続できません。もう一度やり直してください。"],
                ["EMT-04", "接続できません。もう一度やり直してください。"],
                ["EMT-05", "接続できません。もう一度やり直してください。"]
            ])("サーバから%sエラーが返却された時", (errorCode, errorMessage) => {
                beforeEach(() => {
                    rendering();
                });

                test(`エラーメッセージ「${errorMessage}」を表示する`, async () => {
                    server.use(
                        http.get("http://localhost:3000/api/emote", ({ request }) => {
                            const url = new URL(request.url);
                            const hasSequence = url.searchParams.has("sequenceNumberStartOfSearch");
                            if (hasSequence) {
                                return HttpResponse.json({ data: errorCode }, { status: 400 });
                            }
                            return HttpResponse.json({
                                emotes: [
                                    {
                                        sequenceNumber: 20,
                                        emoteId: "a",
                                        userName: "User X",
                                        userId: "@a",
                                        emoteDatetime: "2025-01-01T09:00:00.000Z",
                                        emoteReactionId: "reaction-a",
                                        emoteEmojis: [
                                            {
                                                emojiId: ":rabbit:"
                                            },
                                            {
                                                emojiId: ":rabbit:"
                                            },
                                            {
                                                emojiId: ":rabbit:"
                                            },
                                            {
                                                emojiId: ":rabbit:"
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
                                                emojiId: ":cow:",
                                                numberOfReactions: 2,
                                                reactedUserIds: ["@c"]
                                            }
                                        ],
                                        totalNumberOfReactions: 10
                                    }
                                ]
                            });
                        })
                    );

                    await user.click(await screen.findByRole("button", { name: "search もっと見る" }));

                    await waitFor(() => {
                        const alertComponent = screen.getByRole("alert");
                        expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                        expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                    });
                });

                test("もっと見るボタンを表示する", async () => {
                    await waitFor(() => {
                        expect(screen.getByRole("button", { name: "search もっと見る" })).toBeTruthy();
                    });
                });

                test("「最後のエモートです」を表示しない", async () => {
                    await waitFor(() => {
                        expect(screen.queryByText("最後のエモートです")).toBeFalsy();
                    });
                });
            });
        });
    });

    describe("メニューボタンをクリックした時", () => {
        test("メニューボタンをクリックした時、メニューモーダルが表示される", async () => {
            rendering();

            await user.click(await screen.findByRole("img", { name: "menu" }));

            await waitFor(() => {
                expect(screen.getByRole("dialog")).toBeTruthy();
            });
        });
    });
});
