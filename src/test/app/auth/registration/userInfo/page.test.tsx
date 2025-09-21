// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import RegistrationUserInfoPage from "@/app/auth/registration/userInfo/page";
import { ProviderTemplate } from "@/components/template";
import { useAuthInfoStore } from "@/store";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

const mockPostUser = vi.fn();
const server = setupServer(
    http.post("http://localhost:3000/api/user/:userId", () => {
        mockPostUser();
        return HttpResponse.json({
            userId: "@test"
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

afterAll(() => {
    server.close();
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <RegistrationUserInfoPage />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("ユーザー名テキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("textbox", { name: "ユーザー名" })).toBeTruthy();
        });
    });

    test("ユーザーIDテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByLabelText("ユーザーID")).toBeTruthy();
        });
    });

    test("ユーザー登録ボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "ユーザー登録" })).toBeTruthy();
        });
    });

    test("状態管理からログイン情報が削除される", async () => {
        await waitFor(() => {
            expect(useAuthInfoStore.getState().authInfo.email).toEqual("");
            expect(useAuthInfoStore.getState().authInfo.password).toEqual("");
        });
    });
});

describe("ユーザーIDテキストボックス入力時", () => {
    test.each(["abc", "abc123", "abc_123", "abc_"])(
        "ユーザーIDテキストボックスに%sを入力した場合、エラーメッセージが表示されない",
        async (userId) => {
            const userIdInput = await screen.findByLabelText("ユーザーID");
            await user.clear(userIdInput);
            await user.type(userIdInput, userId);
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        }
    );

    test("ユーザーIDを入力しなかった時、「ユーザーIDを入力してください。」というエラーメッセージが表示される", async () => {
        const userIdInput = await screen.findByLabelText("ユーザーID");
        await user.type(userIdInput, "userid");
        await user.clear(userIdInput);
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("ユーザーIDを入力してください。")).toBeTruthy();
        });
    });

    test("ユーザーIDが24文字以上の時、「1文字〜23文字で入力してください。」というエラーメッセージが表示される", async () => {
        const userIdInput = await screen.findByLabelText("ユーザーID");
        await user.type(userIdInput, "X".repeat(24));
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("1文字〜23文字で入力してください。")).toBeTruthy();
        });
    });

    test.each(["Abc", "abc-123", "abc.123", "abc@123", "abc 123"])(
        "ユーザーIDテキストボックスに%sを入力した場合、「使用できる文字は英小文字・数字・アンダースコア(_)です。」というエラーメッセージが表示される",
        async (userId) => {
            const userIdInput = await screen.findByLabelText("ユーザーID");
            await user.clear(userIdInput);
            await user.type(userIdInput, userId);
            await user.tab();

            await waitFor(() => {
                expect(
                    within(screen.getByRole("alert")).getByText(
                        "使用できる文字は英小文字・数字・アンダースコア(_)です。"
                    )
                ).toBeTruthy();
            });
        }
    );
});

describe("ユーザー名テキストボックス入力時", () => {
    test.each(["A", "User.Name", "foo-bar", "HELLO_WORLD", ".-_.", "Z9.-_", "X".repeat(24)])(
        "ユーザー名テキストボックスに%sを入力した場合、エラーメッセージが表示されない",
        async (userName) => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
            await user.clear(userNameInput);
            await user.type(userNameInput, userName);
            // NOTE: テキストボックスからフォーカスアウトする
            await user.tab();

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        }
    );

    test("ユーザー名を入力しなかった時、「ユーザー名を入力してください。」というエラーメッセージが表示される", async () => {
        const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
        await user.type(userNameInput, "username");
        await user.clear(userNameInput);
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("ユーザー名を入力してください。")).toBeTruthy();
        });
    });

    test("ユーザー名が25文字以上の時、「1文字〜24文字で入力してください。」というエラーメッセージが表示される", async () => {
        const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
        await user.type(userNameInput, "X".repeat(25));
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("1文字〜24文字で入力してください。")).toBeTruthy();
        });
    });

    test.each(["ユーザーネーム", "ゆーざーねーむ", "🐍", "@/", " name "])(
        "ユーザー名テキストボックスに%sを入力した場合、「使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。」というエラーメッセージが表示される",
        async (userName) => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
            await user.clear(userNameInput);
            await user.type(userNameInput, userName);
            await user.tab();

            await waitFor(() => {
                expect(
                    within(screen.getByRole("alert")).getByText(
                        "使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。"
                    )
                ).toBeTruthy();
            });
        }
    );
});

describe("ユーザー登録ボタン押下時", () => {
    describe("入力値が正常な時", () => {
        beforeEach(async () => {
            const userIdInput = await screen.findByLabelText("ユーザーID");
            await user.type(userIdInput, "test");
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
            await user.type(userNameInput, "test");
            await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
        });

        test("ユーザー登録APIを呼び出す", async () => {
            await waitFor(() => {
                expect(mockPostUser).toHaveBeenCalled();
            });
        });

        test("ユーザー画像登録画面に遷移する", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).toHaveBeenCalledWith("/auth/registration/@test/userIcon");
            });
        });
    });

    describe("ユーザーIDが不正な時", () => {
        describe("ユーザーIDが入力されていない時", () => {
            beforeEach(async () => {
                const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
                await user.type(userNameInput, "test");
                await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
            });

            test("ユーザー登録APIを呼び出さない", async () => {
                await waitFor(() => {
                    expect(mockPostUser).not.toHaveBeenCalled();
                });
            });

            test("ユーザー画像登録画面に遷移しない", async () => {
                await waitFor(() => {
                    expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/@test/userIcon");
                });
            });
        });

        describe.each(["Abc", "abc-123", "abc.123", "abc@123", "abc 123", "a".repeat(24)])(
            "ユーザーIDが%sの時",
            async (userId) => {
                beforeEach(async () => {
                    const userIdInput = await screen.findByLabelText("ユーザーID");
                    await user.type(userIdInput, userId);

                    const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
                    await user.type(userNameInput, "test");
                    await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
                });

                test("ユーザー登録APIを呼び出さない", async () => {
                    await waitFor(() => {
                        expect(mockPostUser).not.toHaveBeenCalled();
                    });
                });

                test("ユーザー画像登録画面に遷移しない", async () => {
                    await waitFor(() => {
                        expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/@test/userIcon");
                    });
                });
            }
        );
    });

    describe("ユーザー名が不正な時", () => {
        describe("ユーザー名が入力されていない時", () => {
            beforeEach(async () => {
                const userIdInput = await screen.findByLabelText("ユーザーID");
                await user.type(userIdInput, "test");
                await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
            });

            test("ユーザー登録APIを呼び出さない", async () => {
                await waitFor(() => {
                    expect(mockPostUser).not.toHaveBeenCalled();
                });
            });

            test("ユーザー画像登録画面に遷移しない", async () => {
                await waitFor(() => {
                    expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/@test/userIcon");
                });
            });
        });

        describe.each(["ユーザーネーム", "ゆーざーねーむ", "🐍", "@/", " name ", "X".repeat(25)])(
            "ユーザー名が%sの時",
            async (userName) => {
                beforeEach(async () => {
                    const userIdInput = await screen.findByLabelText("ユーザーID");
                    await user.type(userIdInput, "test");
                    const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
                    await user.type(userNameInput, userName);
                    await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
                });

                test("ユーザー登録APIを呼び出さない", async () => {
                    await waitFor(() => {
                        expect(mockPostUser).not.toHaveBeenCalled();
                    });
                });

                test("ユーザー画像登録画面に遷移しない", async () => {
                    await waitFor(() => {
                        expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/@test/userIcon");
                    });
                });
            }
        );
    });

    describe.each([
        ["USE-31", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-32", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-33", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-34", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-35", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["USE-36", "このユーザーIDは既に使用されています。"],
        ["USE-37", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["USE-91", "不正なリクエストです。もう一度やり直してください。"]
    ])("ユーザー登録APIで%sエラーが返却された時", async (errorCode: string, errorMessage: string) => {
        beforeEach(async () => {
            server.use(
                http.post("http://localhost:3000/api/user/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );

            const userIdInput = await screen.findByLabelText("ユーザーID");
            await user.type(userIdInput, "test");
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名" });
            await user.type(userNameInput, "test");
            await user.click(screen.getByRole("button", { name: "ユーザー登録" }));
        });

        test("エラーメッセージを表示する", async () => {
            await waitFor(() => {
                expect(screen.getByRole("alert")).toBeTruthy();
                expect(within(screen.getByRole("alert")).getByText(errorMessage)).toBeTruthy();
            });
        });

        test("ユーザー画像登録画面に遷移しない", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/@test/userIcon");
            });
        });
    });
});
