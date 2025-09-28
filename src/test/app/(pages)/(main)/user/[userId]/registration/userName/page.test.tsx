// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import UserNameRegistrationPage from "@/app/(pages)/(main)/user/[userId]/registration/userName/page";
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

const mockGetUser = vi.fn();
const mockPostUserName = vi.fn();
const server = setupServer(
    http.get("http://localhost:3000/api/user/:userId", () => {
        mockGetUser();
        return HttpResponse.json({
            userId: "@x",
            userName: "UserX",
            userAvatarUrl: "https://image.test/x.png"
        });
    }),
    http.post("http://localhost:3000/api/user/:userId/userName", () => {
        mockPostUserName();
        return HttpResponse.json({});
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
                        userInfo: { userId: "@x", userName: "UserX", userAvatarUrl: "https://image.test/x.png" }
                    }}
                >
                    <WebSocketProvider>
                        <UserNameRegistrationPage />
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("ユーザー情報取得APIを呼び出す", () => {
        expect(mockGetUser).toHaveBeenCalled();
    });

    test("ユーザー情報表示に戻るボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "ユーザー情報表示に戻る" })).toBeTruthy();
    });

    test("ユーザーのプロフィール画像を表示する", async () => {
        expect(await screen.findByRole("img", { name: "UserXのトッププロフィール画像" })).toBeTruthy();
    });

    test("ユーザーIDを表示する", async () => {
        expect(await screen.findByText("@x")).toBeTruthy();
    });

    test("ユーザー名入力テキストボックスを表示する", async () => {
        expect(await screen.findByRole("textbox", { name: "ユーザー名：" })).toBeTruthy();
    });

    test("ユーザー名入力テキストボックスの初期値として、現在のユーザー名が表示されている", async () => {
        expect((await screen.findByRole("textbox", { name: "ユーザー名：" })).getAttribute("value")).toBe("UserX");
    });

    test("ユーザー名変更ボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "ユーザー名を変更する" })).toBeTruthy();
    });

    test.each([
        ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
    ])(
        "ユーザー情報取得APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
        async (errorCode, errorMessage) => {
            server.use(
                http.get("http://localhost:3000/api/user/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );

            rendering();
            const alertComponent = await screen.findByRole("alert");

            await waitFor(() => {
                expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
            });
        }
    );
});

test("ユーザー情報表示に戻るボタン押下時、ユーザー情報表示画面に戻る", async () => {
    await user.click(await screen.findByRole("button", { name: "ユーザー情報表示に戻る" }));

    expect(mockedUseRouterPush).toHaveBeenCalledWith("/user/@x");
});

describe("ユーザー名テキストボックス入力時", () => {
    test.each(["A", "User.Name", "foo-bar", "HELLO_WORLD", ".-_.", "Z9.-_", "X".repeat(24)])(
        "ユーザー名テキストボックスに%sを入力した場合、エラーメッセージが表示されない",
        async (userName) => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
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
        await user.clear(await screen.findByRole("textbox", { name: "ユーザー名：" }));
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("ユーザー名を入力してください。")).toBeTruthy();
        });
    });

    test("ユーザー名が25文字以上の時、「1文字〜24文字で入力してください。」というエラーメッセージが表示される", async () => {
        const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
        await user.type(userNameInput, "X".repeat(25));
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("1文字〜24文字で入力してください。")).toBeTruthy();
        });
    });

    test.each(["ユーザーネーム", "ゆーざーねーむ", "🐍", "@/", " name "])(
        "ユーザー名テキストボックスに%sを入力した場合、「使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。」というエラーメッセージが表示される",
        async (userName) => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
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

test.todo("ユーザー名変更ボタン押下時", () => {
    describe("ユーザー名テキストボックスに入力した文字が正常な文字列である場合", () => {
        test.each(["A", "User.Name", "foo-bar", "HELLO_WORLD", ".-_.", "Z9.-_", "X".repeat(24)])(
            "ユーザー名テキストボックスに%sを入力した場合、エラーメッセージが表示されない",
            async (userName) => {
                const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
                await user.clear(userNameInput);
                await user.type(userNameInput, userName);

                await user.click(await screen.findByRole("button", { name: "ユーザー名を変更する" }));

                await waitFor(() => {
                    expect(screen.queryByRole("alert")).toBeNull();
                });
            }
        );

        test("ローディングアイコンを表示する", async () => {
            server.use(
                http.post("http://localhost:3000/api/userName/:userId", () => {
                    return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                })
            );

            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(userNameInput, "validName");
            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(screen.getByRole("button", { name: "loading ユーザー名を変更する" })).toBeTruthy();
            });
        });

        test("ユーザー名を変更するAPIを呼び出す", async () => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(userNameInput, "validName");

            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(mockPostUserName).toHaveBeenCalled();
            });
        });

        test("ユーザー情報表示画面に遷移する", async () => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(userNameInput, "validName");

            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(mockedUseRouterPush).toHaveBeenCalledWith("/user/@x");
            });
        });
    });

    describe("ユーザー名テキストボックスに入力した文字が正常な文字列でない場合", () => {
        test("ユーザー名を入力しなかった時、「ユーザー名を入力してください。」というエラーメッセージが表示される", async () => {
            await user.clear(screen.getByRole("textbox", { name: "ユーザー名：" }));
            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("ユーザー名を入力してください。")).toBeTruthy();
            });
        });

        test("ユーザー名が25文字以上の時、「1文字〜24文字で入力してください。」というエラーメッセージが表示される", async () => {
            await user.type(screen.getByRole("textbox", { name: "ユーザー名：" }), "X".repeat(25));
            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("1文字〜24文字で入力してください。")).toBeTruthy();
            });
        });

        test.each(["ユーザーネーム", "ゆーざーねーむ", "🐍", "@/", " name "])(
            "ユーザー名テキストボックスに%sを入力した場合、「使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。」というエラーメッセージが表示される",
            async (userName) => {
                await user.type(screen.getByRole("textbox", { name: "ユーザー名：" }), userName);
                await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

                await waitFor(() => {
                    expect(
                        within(screen.getByRole("alert")).getByText(
                            "使用できる文字は英数字・ドット(.)・アンダースコア(_)・ハイフン(-)です。"
                        )
                    ).toBeTruthy();
                });
            }
        );

        test("ユーザー名を変更するAPIを呼び出さない", async () => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(userNameInput, "不適切なユーザー名");

            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(mockPostUserName).not.toHaveBeenCalled();
            });
        });

        test("ユーザー情報表示画面に遷移しない", async () => {
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(screen.getByRole("textbox", { name: "ユーザー名：" }), "不適切なユーザー名");

            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                expect(mockedUseRouterPush).not.toHaveBeenCalled();
            });
        });
    });

    test.each([
        ["USE-21", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-22", "サンプルユーザーはユーザー名を変えることが出来ません。"],
        ["USE-23", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-24", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["USE-25", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["USE-26", "ユーザー名の形式が不正です。"],
        ["USE-27", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
    ])(
        "ユーザー名変更APIで%sエラーが返却された時、エラーメッセージ「%s」を表示する",
        async (errorCode, errorMessage) => {
            server.use(
                http.post("http://localhost:3000/api/userName/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );
            const userNameInput = await screen.findByRole("textbox", { name: "ユーザー名：" });
            await user.clear(userNameInput);
            await user.type(userNameInput, "validName");

            await user.click(screen.getByRole("button", { name: "ユーザー名を変更する" }));

            await waitFor(() => {
                const alertComponent = screen.getByRole("alert");
                expect(within(alertComponent).getByText(`Error : ${errorCode}`)).toBeTruthy();
                expect(within(alertComponent).getByText(errorMessage as string)).toBeTruthy();
            });
        }
    );
});
