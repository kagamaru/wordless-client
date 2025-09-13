// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "./vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import Home from "@/app/(main)/page";
import {
    ErrorBoundary,
    PageTemplate,
    ProviderTemplate,
    UserInfoContext,
    WebSocketProvider
} from "@/components/template";
import { ReactRequest } from "@/@types";
import { useEmoteStore } from "@/store";

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
    })
}));
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn((_token: string) => {
        return {
            sub: "mock-sub"
        };
    })
}));

const server = setupServer(
    http.get("http://localhost:3000/api/emote", ({ request }) => {
        const urlSearchParams = new URL(request.url).searchParams;
        const sequenceNumberStartOfSearch = urlSearchParams.get("sequenceNumberStartOfSearch");

        return HttpResponse.json({
            emotes: sequenceNumberStartOfSearch
                ? [
                      {
                          sequenceNumber: 16,
                          emoteId: "e",
                          userName: "A",
                          userId: "@a",
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
                          userName: "B",
                          userId: "@b",
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
                          userName: "C",
                          userId: "@c",
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
                          userName: "D",
                          userId: "@d",
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
                          userName: "A",
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
                      },
                      {
                          sequenceNumber: 19,
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
                          userName: "C",
                          userId: "@c",
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
    http.get("http://localhost:3000/api/user/:userId", ({ params }) => {
        const { userId } = params;

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
    useEmoteStore.getState().cleanAllData();
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
                            <Home />
                        </PageTemplate>
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};
describe("初期表示時", () => {
    describe("正常系", () => {
        test("エモートをサーバから受け取った数表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getAllByRole("listitem").length).toBe(4);
            });
        });

        test("投稿者の名前を表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getByText("A")).toBeTruthy();
                expect(screen.getByText("B")).toBeTruthy();
                expect(screen.getByText("C")).toBeTruthy();
            });
        });

        test("投稿者のアカウント名を表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getByText("@a")).toBeTruthy();
                expect(screen.getByText("@b")).toBeTruthy();
                expect(screen.getByText("@c")).toBeTruthy();
            });
        });

        test("投稿日時を表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getByText("2025-01-01 18:00:00")).toBeTruthy();
                expect(screen.getByText("2024-01-01 18:12:30")).toBeTruthy();
                expect(screen.getByText("2023-01-01 18:00:00")).toBeTruthy();
            });
        });

        test("絵文字を表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(within(screen.getByRole("listitem", { name: "a" })).getAllByLabelText(":rabbit:").length).toBe(
                    4
                );
                expect(
                    within(screen.getByRole("listitem", { name: "b" })).getAllByLabelText(":smiling_face:").length
                ).toBe(3);
                expect(within(screen.getByRole("listitem", { name: "c" })).getAllByLabelText(":rabbit:").length).toBe(
                    1
                );
                expect(within(screen.getByRole("listitem", { name: "d" })).getAllByLabelText(":test:").length).toBe(1);
            });
        });

        test("投稿者のプロフィール画像を表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getByAltText("AProfileImage")).toBeTruthy();
                expect(screen.getByAltText("BProfileImage")).toBeTruthy();
                expect(screen.getByAltText("BProfileImage")).toBeTruthy();
            });
        });

        describe("リアクションの総件数を表示する時", () => {
            test("リアクションの総件数が0件の時、何も表示しない", async () => {
                rendering();

                // NOTE: ＋ボタンが1つだけ表示される
                await waitFor(() => {
                    expect(within(screen.getByRole("listitem", { name: "c" })).getAllByRole("button").length).toBe(1);
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
                    // NOTE: プラスボタンがあるため個数は1になる
                    expect(within(screen.getByRole("listitem", { name: "c" })).getAllByRole("button").length).toBe(1);
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

        test("投稿ボタンを表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getByRole("button", { name: "エモート投稿ボタン" })).toBeTruthy();
            });
        });
    });

    describe("異常系", () => {
        test.for([
            ["EMT-01", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-02", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-03", "接続できません。もう一度やり直してください。"],
            ["EMT-04", "接続できません。もう一度やり直してください。"],
            ["EMT-05", "接続できません。もう一度やり直してください。"]
        ])("サーバから%sエラーが返却された時、エラーメッセージ「%s」を表示する", async ([errorCode, errorMessage]) => {
            server.use(
                http.get("http://localhost:3000/api/emote", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );

            rendering();

            await waitFor(() => {
                const alertComponent = screen.getByRole("alert");
                expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
            });
        });
    });
});

describe("初期表示前のエモート取得中", () => {
    beforeEach(() => {
        server.use(
            http.get("http://localhost:3000/api/emote", () => {
                return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
            })
        );
    });

    test("ローディングスピナーを表示する", async () => {
        rendering();

        await waitFor(() => {
            expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
        });
    });

    test("もっと見るボタンを表示しない", async () => {
        rendering();

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "search もっと見る" })).toBeFalsy();
        });
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
                    expect(within(screen.getByRole("link", { name: "User A @a" })).getByText("User A")).toBeTruthy();
                    expect(within(screen.getByRole("link", { name: "User B @b" })).getByText("User B")).toBeTruthy();
                    expect(within(screen.getByRole("link", { name: "User C @c" })).getByText("User C")).toBeTruthy();
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
                expect(within(screen.getByRole("dialog")).getByText("ユーザー情報の取得に失敗しました。")).toBeTruthy();
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
        });
    });
});

test("ユーザー名をクリックした時、ユーザーページに遷移する", async () => {
    rendering();

    await user.click(await screen.findByText("A"));

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/user/@a");
    });
});

test("ユーザーIDをクリックした時、ユーザーページに遷移する", async () => {
    rendering();

    await user.click(await screen.findByText("@a"));

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/user/@a");
    });
});

test("ユーザーアバターをクリックした時、ユーザーページに遷移する", async () => {
    rendering();

    await user.click(await screen.findByAltText("AProfileImage"));

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/user/@a");
    });
});

describe("リアクション追加ボタンをクリックした時", () => {
    describe("正常系", () => {
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

        test("リアクション追加ボタンをクリックした時、リアクション追加モーダルが表示される", async () => {
            await waitFor(() => {
                expect(screen.getByRole("dialog")).toBeTruthy();
            });
        });

        describe("リアクション追加モーダル表示時", () => {
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
                    const nekoMemeSurpriseCatImage = screen.getByRole("button", { name: ":neko_meme_surprising_cat:" });
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
                        within(await screen.findByRole("listitem", { name: "b" })).getByRole("button", { name: "+" })
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
    });
});

describe("投稿ボタンをクリックした時", () => {
    test("投稿ボタンをクリックした時、投稿モーダルが表示される", async () => {
        rendering();

        await user.click(screen.getByRole("button", { name: "エモート投稿ボタン" }));

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/post");
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

        const moreButton = await screen.findByRole("button", { name: "search もっと見る" });
        await user.click(moreButton);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "loading もっと見る" })).toBeTruthy();
        });
    });

    describe("エモート取得成功時", () => {
        describe("取得したエモートが1件以上だった時", () => {
            beforeEach(async () => {
                rendering();
                const moreButton = await screen.findByRole("button", { name: "search もっと見る" });
                await user.click(moreButton);
            });

            test("取得したエモートを表示する", async () => {
                await waitFor(() => {
                    expect(screen.getAllByRole("listitem").length).toBe(8);
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

                const moreButton = await screen.findByRole("button", { name: "search もっと見る" });
                await user.click(moreButton);
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
        test.for([
            ["EMT-01", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-02", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-03", "接続できません。もう一度やり直してください。"],
            ["EMT-04", "接続できません。もう一度やり直してください。"],
            ["EMT-05", "接続できません。もう一度やり直してください。"]
        ])("サーバから%sエラーが返却された時、エラーメッセージ「%s」を表示する", async ([errorCode, errorMessage]) => {
            rendering();
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
                                userName: "A",
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

            const moreButton = await screen.findByRole("button", { name: "search もっと見る" });
            await user.click(moreButton);

            await waitFor(() => {
                const alertComponent = screen.getByRole("alert");
                expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
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
