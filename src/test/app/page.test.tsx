import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { vitestSetup } from "./vitest.setup";
import Home from "@/app/(main)/page";
import { ProviderTemplate, WebSocketProvider } from "@/components/template";
import { ReactRequest } from "@/@types";

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
                userAvatarUrl: "https://a.png",
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
                userAvatarUrl: "https://b.png",
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
                userAvatarUrl: "https://c.png",
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
                userAvatarUrl: "https://d.png",
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
});

const mockFindUser = vi.fn((userId: string) => {
    switch (userId) {
        case "@a":
            return Promise.resolve({
                userId: "@a",
                userName: "User A",
                userAvatarUrl: "https://user-a.png"
            });
        case "@b":
            return Promise.resolve({
                userId: "@b",
                userName: "User B",
                userAvatarUrl: "https://user-b.png"
            });
        case "@c":
            return Promise.resolve({
                userId: "@c",
                userName: "User C",
                userAvatarUrl: "https://user-c.png"
            });
        case "@fuga_fuga":
            return Promise.resolve({
                userId: "@fuga_fuga",
                userName: "User Fuga",
                userAvatarUrl: "https://user-fuga.png"
            });
        default:
            return Promise.resolve({
                userId: "@user1",
                userName: "User One",
                userAvatarUrl: "https://user1.png"
            });
    }
});

const mockOnReact = vi.fn((_request: ReactRequest) => {});
vi.mock("@/app/api", async () => {
    const actual = await vi.importActual<typeof import("@/app/api")>("@/app/api");

    return {
        ...actual,
        EmoteService: class {
            fetchEmotes = mockFetchEmotes;
        },
        UserService: class {
            findUser = mockFindUser;
        },
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
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <WebSocketProvider>
                <Home />
            </WebSocketProvider>
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
                expect(screen.getAllByLabelText(":panda:").length).toBe(4);
                expect(screen.getAllByLabelText(":smiling_face:").length).toBe(3);
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
    });

    describe("異常系", () => {
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

        test("localStorageからのIdToken取得に失敗した時、リダイレクトする", async () => {
            vi.stubGlobal("localStorage", {
                getItem: vi.fn().mockReturnValue(null)
            });

            rendering();

            await waitFor(() => {
                expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
            });
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
        // TODO: 表示まで時間がかかり、テスト実行が困難
        test.todo("ユーザー情報取得APIに全て失敗した時、「ユーザー情報の取得に失敗しました。」と表示する");

        test.todo("ユーザー情報取得APIに一部失敗した時、「情報を取得できなかったユーザーがいます。」と表示する");
    });
});

describe("リアクションボタンをクリックした時", () => {
    describe("正常系", () => {
        beforeEach(() => {
            rendering();
        });

        describe("未リアクションのリアクションボタンをクリックした時", () => {
            test("絵文字リアクションAPIがincrement操作で呼び出される", async () => {
                await user.click(
                    within(await screen.findByRole("listitem", { name: "a" })).getByRole("button", {
                        name: "reaction-a:party_parrot:"
                    })
                );

                await waitFor(() => {
                    expect(mockOnReact).toHaveBeenCalledWith({
                        emoteReactionId: "reaction-a",
                        reactedEmojiId: ":party_parrot:",
                        reactedUserId: "@fuga_fuga",
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
                await user.click(
                    within(await screen.findByRole("listitem", { name: "b" })).getByRole("button", {
                        name: "reaction-b:tiger:"
                    })
                );

                await waitFor(() => {
                    expect(mockOnReact).toHaveBeenCalledWith({
                        emoteReactionId: "reaction-b",
                        reactedEmojiId: ":tiger:",
                        reactedUserId: "@fuga_fuga",
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

describe("リアクション追加ボタンをクリックした時", () => {
    describe("正常系", () => {
        beforeEach(async () => {
            rendering();

            await user.click(
                within(await screen.findByRole("listitem", { name: "b" })).getByRole("button", { name: "+" })
            );
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
                await user.type(screen.getByPlaceholderText("絵文字を検索..."), "dolphin");

                await waitFor(() => {
                    expect(screen.getByText("🐬")).toBeTruthy();
                    // NOTE: 「dolphin」以外の絵文字が表示されていないことを検証
                    expect(screen.queryByText("🦁")).toBeFalsy();
                });
            });

            test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                await user.type(screen.getByPlaceholderText("絵文字を検索..."), "ライオン");

                await waitFor(() => {
                    expect(screen.getByText("🦁")).toBeTruthy();
                    // NOTE: 「ライオン」以外の絵文字が表示されていないことを検証
                    expect(screen.queryByText("🐬")).toBeFalsy();
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
                        // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
                        const img = screen.getAllByAltText("ラスト").find((img) => img.getAttribute("width") === "32");
                        expect(img).toBeTruthy();
                        // NOTE: 「ラスト」以外の絵文字が表示されていないことを検証
                        expect(screen.queryByAltText("こんにちは")).toBeFalsy();
                    });
                });

                test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "ラスト");

                    await waitFor(() => {
                        // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
                        const img = screen.getAllByAltText("ラスト").find((img) => img.getAttribute("width") === "32");
                        expect(img).toBeTruthy();
                        // NOTE: 「ラスト」以外の絵文字が表示されていないことを検証
                        expect(screen.queryByAltText("こんにちは")).toBeFalsy();
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
                        // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
                        const img = screen
                            .getAllByAltText("猫ミーム_驚く猫")
                            .find((img) => img.getAttribute("width") === "32");
                        expect(img).toBeTruthy();
                        // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                        expect(screen.queryByAltText("猫ミーム_叫ぶ猫")).toBeFalsy();
                    });
                });

                test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");

                    await waitFor(() => {
                        // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
                        const img = screen
                            .getAllByAltText("猫ミーム_驚く猫")
                            .find((img) => img.getAttribute("width") === "32");
                        expect(img).toBeTruthy();
                        // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                        expect(screen.queryByAltText("猫ミーム_叫ぶ猫")).toBeFalsy();
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
                    await user.type(screen.getByPlaceholderText("絵文字を検索..."), "dolphin");
                    await waitFor(() => {
                        // NOTE: 検索結果として表示されていることを検証
                        expect(screen.getByText("🐬")).toBeTruthy();
                        // NOTE: 検索結果として表示されていないことを検証
                        expect(screen.queryByText("🐜")).toBeFalsy();
                    });

                    await user.click(screen.getByRole("button", { name: "close-circle" }));

                    await waitFor(() => {
                        // NOTE: 絵文字の種類に関係なく表示されることを確認
                        expect(screen.getByText("🐬")).toBeTruthy();
                        expect(screen.getByText("🐜")).toBeTruthy();
                    });
                });
            });

            describe("リアクション追加ボタンをクリックした時", () => {
                test("未リアクションの絵文字をクリックした時、絵文字リアクションAPIがincrement操作で呼び出される", async () => {
                    await user.click(within(screen.getByRole("dialog")).getByText("🐬"));

                    await waitFor(() => {
                        expect(mockOnReact).toHaveBeenCalledWith({
                            emoteReactionId: "reaction-b",
                            reactedEmojiId: ":dolphin:",
                            reactedUserId: "@fuga_fuga",
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
                            reactedUserId: "@fuga_fuga",
                            operation: "decrement",
                            Authorization: "mocked_id_token"
                        });
                    });
                });

                test.todo("リアクション追加ボタンをクリックした時、リアクション追加モーダーが閉じられる");
            });

            test("×ボタンクリック時、モーダルが閉じられる", async () => {
                await user.click(await screen.findByRole("button", { name: "close" }));

                await waitFor(() => {
                    expect(screen.queryByRole("dialog")).toBeFalsy();
                });
            });
        });
    });
});
