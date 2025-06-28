import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { vitestSetup } from "../vitest.setup";
import PostPage from "@/app/(main)/post/page";
import { ErrorBoundary, ProviderTemplate, UserInfoTemplate, WebSocketProvider } from "@/components/template";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

vitestSetup();
const user = userEvent.setup();

vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {
            onReact = vi.fn(() => {});
        }
    };
});

const mockedUseRouterPush = vi.fn();
const mockedUseRouterBack = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouterPush,
        back: mockedUseRouterBack
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
    http.get("http://localhost:3000/api/userSub/:userSub", () => {
        return HttpResponse.json({
            userId: "@x",
            userName: "User X",
            userAvatarUrl: "https://image.test/x.png"
        });
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    rendering();
});

afterEach(() => {
    cleanup();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoTemplate>
                    <WebSocketProvider>
                        <PostPage />
                    </WebSocketProvider>
                </UserInfoTemplate>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

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
            expect(screen.getByRole("button", { name: "エモート送信ボタン" })).toBeTruthy();
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
            // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
            const img = screen.getAllByAltText("ラスト").find((img) => img.getAttribute("width") === "32");
            expect(img).toBeTruthy();
        });
    });

    test("絵文字検索テキストボックスに入力後、「ミーム」タブを選択した時、「ミーム」での検索結果が表示される", async () => {
        await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");
        await user.click(screen.getByRole("tab", { name: "ミーム", selected: false }));

        await waitFor(() => {
            // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
            const img = screen.getAllByAltText("猫ミーム_驚く猫").find((img) => img.getAttribute("width") === "32");
            expect(img).toBeTruthy();
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
                const img = screen.getAllByAltText("猫ミーム_驚く猫").find((img) => img.getAttribute("width") === "32");
                expect(img).toBeTruthy();
                // NOTE: 「猫ミーム_驚く猫」以外の絵文字が表示されていないことを検証
                expect(screen.queryByAltText("猫ミーム_叫ぶ猫")).toBeFalsy();
            });
        });

        test("絵文字検索テキストボックス入力時に日本語入力時、検索結果が表示される", async () => {
            await user.type(screen.getByPlaceholderText("絵文字を検索..."), "驚く猫");

            await waitFor(() => {
                // HACK: next/image の仕様?により二重描画される。絵文字の幅が32pxのものを検証
                const img = screen.getAllByAltText("猫ミーム_驚く猫").find((img) => img.getAttribute("width") === "32");
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
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        [3, 3],
        [4, 1],
        [4, 2],
        [4, 3],
        [4, 4]
    ])(
        "絵文字を%dつ入力後、%dつ目の絵文字の右上の×ボタンを押下した時、残りの絵文字数が%iつになる",
        async (index, count) => {
            const ratButton = screen.getByRole("button", { name: ":rat:" });

            for (let i = 0; i < index; i++) {
                await user.click(ratButton);
            }

            await user.click(
                within(screen.getByRole("option", { selected: true, name: `入力済絵文字${count}` })).getByRole(
                    "button",
                    {
                        name: ":rat:delete-button"
                    }
                )
            );

            await waitFor(() => {
                expect(screen.queryAllByRole("option", { selected: true })).toHaveLength(index - 1);
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

    test("絵文字を1文字も入力していない場合、投稿ボタンが押下できない", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "エモート送信ボタン" }).ariaDisabled).toBe("true");
        });
    });

    test("絵文字を1文字以上入力している場合、投稿ボタンが押下できる", async () => {
        const grinningFaceButton = screen.getByRole("button", { name: ":smiling_face:" });
        const sendEmoteButton = screen.getByRole("button", { name: "エモート送信ボタン" });
        await user.click(grinningFaceButton);

        await waitFor(() => {
            expect(sendEmoteButton.ariaDisabled).toBe("false");
        });
    });
});

test("×ボタン押下時、ドロワーが閉じられる", async () => {
    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
        expect(mockedUseRouterBack).toHaveBeenCalled();
    });
});
