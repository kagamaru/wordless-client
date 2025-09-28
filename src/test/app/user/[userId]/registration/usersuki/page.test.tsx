// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import UserSukiRegistrationPage from "@/app/(main)/user/[userId]/registration/usersuki/page";
import { ErrorBoundary, ProviderTemplate, UserInfoContext, WebSocketProvider } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {
            onReact = vi.fn(() => {});
            onPostEmote = vi.fn(() => {});
        }
    };
});

const mockedUseRouterPush = vi.fn();
const mockedUseRouterBack = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouterPush,
        back: mockedUseRouterBack
    }),
    useParams: () => ({
        userId: "@x"
    })
}));
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn((_token: string) => {
        return {
            sub: "mock-sub"
        };
    })
}));

const mockPostUserSuki = vi.fn();
const server = setupServer(
    http.post("http://localhost:3000/api/userSuki/:userId", () => {
        mockPostUserSuki();
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
    rendering();
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
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
                        <UserSukiRegistrationPage />
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("投稿ドロワーが表示される", () => {
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    describe("投稿ドロワー内に", () => {
        test("閉じるボタンが表示される", () => {
            expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
        });

        test("絵文字入力エリアが4つ表示される", () => {
            expect(screen.getAllByRole("option", { name: "未入力絵文字1" })).toBeTruthy();
            expect(screen.getAllByRole("option", { name: "未入力絵文字2" })).toBeTruthy();
            expect(screen.getAllByRole("option", { name: "未入力絵文字3" })).toBeTruthy();
            expect(screen.getAllByRole("option", { name: "未入力絵文字4" })).toBeTruthy();
        });

        test("送信ボタンが表示される", () => {
            expect(screen.getByRole("button", { name: "ユーザースキ登録ボタン" })).toBeTruthy();
        });

        test("絵文字検索テキストボックスが表示される", () => {
            expect(screen.getByPlaceholderText("絵文字を検索...")).toBeTruthy();
        });

        test("絵文字選択タブで「プリセット」が選択されている", () => {
            expect(screen.getByRole("tab", { name: "プリセット", selected: true })).toBeTruthy();
        });
    });
});

describe("絵文字検索テキストボックス入力時", () => {
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
            const nekoMemeSurprisingCatImage = screen.getByRole("button", {
                name: ":neko_meme_surprising_cat:"
            });
            expect(nekoMemeSurprisingCatImage).toBeTruthy();
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
                const nekoMemeSurprisingCatImage = screen.getByRole("button", {
                    name: ":neko_meme_surprising_cat:"
                });
                expect(nekoMemeSurprisingCatImage).toBeTruthy();
                // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                expect(screen.queryByRole("button", { name: ":neko_meme_scared_cat:" })).toBeFalsy();
            });
        });

        test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
            await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");

            await waitFor(() => {
                const nekoMemeSurprisingCatImage = screen.getByRole("button", {
                    name: ":neko_meme_surprising_cat:"
                });
                expect(nekoMemeSurprisingCatImage).toBeTruthy();
                // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                expect(screen.queryByRole("button", { name: ":neko_meme_scared_cat:" })).toBeFalsy();
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
});

describe("絵文字クリック時", () => {
    test.each([1, 2, 3, 4])(`絵文字を%i回クリックした時、絵文字がその数だけ表示される`, async (index) => {
        const button = screen.getByRole("button", { name: ":smiling_face:" });

        for (let i = 0; i < index; i++) {
            await user.click(button);
        }

        await waitFor(() => {
            expect(screen.getAllByRole("option", { selected: true })).toHaveLength(index);
        });
    });

    test("プリセット絵文字入力時、右上に×ボタンが表示される", async () => {
        await user.click(screen.getByRole("button", { name: ":smiling_face:" }));

        await waitFor(async () => {
            expect(
                within(screen.getByRole("option", { selected: true })).getByRole("button", {
                    name: ":smiling_face:delete-button"
                })
            ).toBeTruthy();
        });
    });

    test("カスタム絵文字入力時、右上に×ボタンが表示される", async () => {
        await user.click(screen.getByRole("tab", { name: "カスタム", selected: false }));

        await user.click(screen.getByRole("button", { name: ":last:" }));

        await waitFor(() => {
            expect(
                within(screen.getByRole("option", { selected: true })).getByRole("button", {
                    name: ":last:delete-button"
                })
            ).toBeTruthy();
        });
    });

    test("ミーム絵文字入力時、右上に×ボタンが表示される", async () => {
        await user.click(screen.getByRole("tab", { name: "ミーム", selected: false }));

        await user.click(screen.getByRole("button", { name: ":party_parrot:" }));

        await waitFor(() => {
            expect(
                within(screen.getByRole("option", { selected: true })).getByRole("button", {
                    name: ":party_parrot:delete-button"
                })
            ).toBeTruthy();
        });
    });

    test("絵文字を1つ入力後、1つ目の絵文字の右上の×ボタンを押下した時、入力された絵文字が1つも無くなる", async () => {
        await user.click(screen.getByRole("button", { name: ":smiling_face:" }));

        await user.click(
            within(screen.getByRole("option", { selected: true })).getByRole("button", {
                name: ":smiling_face:delete-button"
            })
        );

        await waitFor(() => {
            expect(screen.queryAllByRole("option", { selected: true })).toHaveLength(0);
        });
    });

    test.each([
        [2, 1, 1],
        [2, 2, 1],
        [3, 1, 2],
        [3, 2, 2],
        [3, 3, 2],
        [4, 1, 3],
        [4, 2, 3],
        [4, 3, 3],
        [4, 4, 3]
    ])(
        "絵文字を%dつ入力後、%dつ目の絵文字の右上の×ボタンを押下した時、残りの絵文字数が%dつになる",
        async (pressedEmojiCount, deleteIndex, expectedEmojiCount) => {
            const ratButton = screen.getByRole("button", { name: ":rat:" });

            for (let i = 0; i < pressedEmojiCount; i++) {
                await user.click(ratButton);
            }

            await user.click(
                within(screen.getByRole("option", { selected: true, name: `入力済絵文字${deleteIndex}` })).getByRole(
                    "button",
                    {
                        name: ":rat:delete-button"
                    }
                )
            );

            await waitFor(() => {
                expect(screen.queryAllByRole("option", { selected: true })).toHaveLength(expectedEmojiCount);
                for (let i = 1; i < pressedEmojiCount; i++) {
                    expect(screen.getByRole("option", { selected: true, name: `入力済絵文字${i}` })).toBeTruthy();
                }
            });
        }
    );

    test("絵文字を4つ入力した後さらに絵文字を入力すると、一番先頭の絵文字が消えた上で新しい絵文字が入力される", async () => {
        const grinningFaceButton = screen.getByRole("button", { name: ":smiling_face:" });
        const ratButton = screen.getByRole("button", { name: ":rat:" });
        const cowButton = screen.getByRole("button", { name: ":cow:" });
        const tigerButton = screen.getByRole("button", { name: ":tiger:" });
        const rabbitButton = screen.getByRole("button", { name: ":rabbit:" });

        await user.click(grinningFaceButton);
        await user.click(ratButton);
        await user.click(cowButton);
        await user.click(tigerButton);
        await user.click(rabbitButton);

        await waitFor(() => {
            expect(
                within(screen.getByRole("option", { selected: true, name: "入力済絵文字1" })).queryByText("😀")
            ).toBeFalsy();
            expect(
                within(screen.getByRole("option", { selected: true, name: "入力済絵文字1" })).getByText("🐀")
            ).toBeTruthy();
            expect(
                within(screen.getByRole("option", { selected: true, name: "入力済絵文字2" })).getByText("🐄")
            ).toBeTruthy();
            expect(
                within(screen.getByRole("option", { selected: true, name: "入力済絵文字3" })).getByText("🐅")
            ).toBeTruthy();
            expect(
                within(screen.getByRole("option", { selected: true, name: "入力済絵文字4" })).getByText("🐇")
            ).toBeTruthy();
        });
    });

    test("入力された絵文字が0文字でも、投稿ボタンが押下可能である", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "ユーザースキ登録ボタン" }).ariaDisabled).toBe("false");
        });
    });

    test("絵文字を1文字以上入力している場合、投稿ボタンが押下できる", async () => {
        const grinningFaceButton = screen.getByRole("button", { name: ":smiling_face:" });
        const sendEmoteButton = screen.getByRole("button", { name: "ユーザースキ登録ボタン" });
        await user.click(grinningFaceButton);

        await waitFor(() => {
            expect(sendEmoteButton.ariaDisabled).toBe("false");
        });
    });
});

describe("送信ボタン押下時", () => {
    beforeEach(async () => {
        const ratButton = screen.getByRole("button", { name: ":rat:" });
        const cowButton = screen.getByRole("button", { name: ":cow:" });
        const tigerButton = screen.getByRole("button", { name: ":tiger:" });
        const rabbitButton = screen.getByRole("button", { name: ":rabbit:" });
        await Promise.all([
            user.click(ratButton),
            user.click(cowButton),
            user.click(tigerButton),
            user.click(rabbitButton)
        ]);
    });

    test("ローディングアイコンが表示される", async () => {
        server.use(
            http.post("http://localhost:3000/api/userSuki/:userId", () => {
                return new Promise(() => {}); // NOTE: 永続的にローディングを維持
            })
        );
        const sendEmoteButton = screen.getByRole("button", { name: "ユーザースキ登録ボタン" });
        await user.click(sendEmoteButton);

        await waitFor(() => {
            expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
            expect(sendEmoteButton.ariaDisabled).toBe("true");
        });
    });

    test("エモート-登録APIが呼び出される", async () => {
        await user.click(await screen.findByRole("button", { name: "ユーザースキ登録ボタン" }));

        await waitFor(() => {
            expect(mockPostUserSuki).toHaveBeenCalled();
        });
    });

    test("モーダルが閉じられる", async () => {
        await user.click(screen.getByRole("button", { name: "ユーザースキ登録ボタン" }));

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeFalsy();
        });
    });

    test("ユーザー情報表示画面に遷移する", async () => {
        await user.click(screen.getByRole("button", { name: "ユーザースキ登録ボタン" }));

        await waitFor(() => {
            expect(mockedUseRouterPush).toHaveBeenCalledWith("/user/@x");
        });
    });

    describe("異常系", () => {
        test.each([
            ["USK-11", "不正なリクエストです。もう一度やり直してください。"],
            ["USK-12", "不正なリクエストです。もう一度やり直してください。"],
            ["USK-13", "不正なリクエストです。もう一度やり直してください。"],
            ["USK-14", "不正なリクエストです。もう一度やり直してください。"],
            ["USK-15", "指定したユーザーは存在しません。"],
            ["USK-16", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
            ["USK-17", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
        ])(
            "フォロワー取得APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
            async (errorCode, errorMessage) => {
                server.use(
                    http.post("http://localhost:3000/api/userSuki/:userId", () => {
                        return HttpResponse.json({ data: errorCode }, { status: 400 });
                    })
                );

                await user.click(screen.getByRole("button", { name: "ユーザースキ登録ボタン" }));

                await waitFor(() => {
                    const alertComponent = screen.getByRole("alert");
                    expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                    expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
                });
            }
        );
    });
});

test("×ボタン押下時、ドロワーが閉じられる", async () => {
    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
        expect(mockedUseRouterBack).toHaveBeenCalled();
    });
});
