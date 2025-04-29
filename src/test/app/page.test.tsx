import Home from "@/app/page";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { vitestSetup } from "./vitest.setup";
import { ProviderTemplate } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockFetchEmotes = vi.fn(() => {
    return Promise.resolve({
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
                        emojiId: ":snake:"
                    },
                    {
                        emojiId: ":snake:"
                    },
                    {
                        emojiId: ":snake:"
                    },
                    {
                        emojiId: ":snake:"
                    }
                ],
                userAvatarUrl: "https://a.png",
                emoteReactionEmojis: [
                    {
                        emojiId: ":party_parrot:",
                        numberOfReactions: 10,
                        reactedUserIds: ["@hoge_hoge"]
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
                        emojiId: ":smile:"
                    },
                    {
                        emojiId: ":smile:"
                    },
                    {
                        emojiId: ":smile:"
                    }
                ],
                userAvatarUrl: "https://b.png",
                emoteReactionEmojis: [
                    {
                        emojiId: ":snake:",
                        numberOfReactions: 200,
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
                userAvatarUrl: "https://c.png",
                emoteReactionEmojis: [],
                totalNumberOfReactions: 0
            }
        ]
    });
});
vi.mock("@/app/api/EmoteService", () => ({
    EmoteService: class {
        fetchEmotes = mockFetchEmotes;
    }
}));

const mockWebSocketOpen = vi.fn(() => {
    return true;
});
const mockUseWebSocket = vi.fn(() => {
    return {
        webSocketOpen: mockWebSocketOpen,
        hasWebSocketError: false,
        webSocketError: {}
    };
});
vi.mock("@/hooks/useWebSocket", () => ({
    useWebSocket: () => mockUseWebSocket()
}));

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

const mockedLocalStorageGetItem = vi.spyOn(globalThis.localStorage, "getItem");
mockedLocalStorageGetItem.mockImplementation((key: string) => {
    if (key === "IdToken") return "mocked_id_token";
    return null;
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

afterEach(() => {
    cleanup();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <Home />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    describe("正常系", () => {
        test("エモートをサーバから受け取った数表示する", async () => {
            rendering();

            await waitFor(() => {
                expect(screen.getAllByRole("listitem").length).toBe(3);
            });
        });

        test("WebSocket API サーバとの接続を確立する", async () => {
            rendering();

            await waitFor(() => {
                expect(mockWebSocketOpen).toHaveBeenCalledTimes(1);
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
                expect(screen.getAllByLabelText(":snake:").length).toBe(4);
                expect(screen.getAllByLabelText(":smile:").length).toBe(3);
                expect(screen.getAllByLabelText(":bear:").length).toBe(1);
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
                        within(screen.getByRole("button", { name: "reaction-b:snake:" })).getByText("99+")
                    ).toBeTruthy();
                });
            });

            test("リアクションがないとき、何も表示しない", async () => {
                rendering();

                await waitFor(() => {
                    // NOTE: プラスボタンがあるため個数は1になる
                    expect(within(screen.getByRole("listitem", { name: "c" })).getAllByRole("button").length).toBe(1);
                });
            });
        });
    });

    describe("異常系", () => {
        test("WebSocket接続エラーが発生した時、エラーメッセージを表示する", async () => {
            mockUseWebSocket.mockReturnValue({
                webSocketOpen: mockWebSocketOpen,
                hasWebSocketError: true,
                webSocketError: {
                    errorCode: "WSK-99",
                    errorMessage: "接続が出来ません。しばらくの間使用できない可能性があります。"
                }
            });

            rendering();

            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("Error : WSK-99")).toBeTruthy();
            });
        });

        test.for([
            ["EMT-01", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-02", "不正なリクエストです。もう一度やり直してください。"],
            ["EMT-03", "接続できません。もう一度やり直してください。"],
            ["EMT-04", "接続できません。もう一度やり直してください。"],
            ["EMT-05", "接続できません。もう一度やり直してください。"]
        ])("サーバから%sエラーが返却された時、エラーメッセージ「%s」を表示する", async ([errorCode, errorMessage]) => {
            mockFetchEmotes.mockRejectedValue(
                new Error(
                    JSON.stringify({
                        error: errorCode
                    })
                )
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

describe("リアクション総数ボタンをクリックした時", () => {
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
                    within(screen.getByRole("link", { name: "User One @user1" })).getByText("User One")
                ).toBeTruthy();
                expect(
                    within(screen.getByRole("link", { name: "User Two @user2" })).getByText("User Two")
                ).toBeTruthy();
                expect(
                    within(screen.getByRole("link", { name: "User Three @user3" })).getByText("User Three")
                ).toBeTruthy();
            });
        });

        test("リアクションしたユーザーのユーザーIDが表示される", async () => {
            await waitFor(() => {
                expect(within(screen.getByRole("link", { name: "User One @user1" })).getByText("@user1")).toBeTruthy();
                expect(within(screen.getByRole("link", { name: "User Two @user2" })).getByText("@user2")).toBeTruthy();
                expect(
                    within(screen.getByRole("link", { name: "User Three @user3" })).getByText("@user3")
                ).toBeTruthy();
            });
        });

        test("×ボタンクリック時、モーダルが閉じられる", async () => {
            await user.click(await screen.findByRole("button", { name: "close" }));

            await waitFor(() => {
                expect(screen.queryByRole("dialog")).toBeFalsy();
            });
        });
    });
});
