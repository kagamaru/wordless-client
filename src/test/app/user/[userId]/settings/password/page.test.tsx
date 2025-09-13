// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "../../../../vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ErrorBoundary, ProviderTemplate, UserInfoContext, WebSocketProvider } from "@/components/template";
import PasswordChange from "@/app/(main)/user/[userId]/settings/password/page";

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

const server = setupServer();

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
                        <PasswordChange />
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("トップ画面に戻るボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "トップ画面に戻る" })).toBeTruthy();
    });

    test("現在のパスワード入力テキストボックスを表示する", async () => {
        expect(await screen.findByLabelText("現在のパスワード")).toBeTruthy();
    });

    test("新しいパスワード入力テキストボックスを表示する", async () => {
        expect(await screen.findByLabelText("新しいパスワード")).toBeTruthy();
    });

    test("新しいパスワード（確認）入力テキストボックスを表示する", async () => {
        expect(await screen.findByLabelText("新しいパスワード（確認）")).toBeTruthy();
    });

    test("パスワード変更ボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "パスワード変更" })).toBeTruthy();
    });
});

test("トップ画面に戻るボタン押下時、トップ画面に遷移する", async () => {
    await user.click(await screen.findByRole("button", { name: "トップ画面に戻る" }));

    expect(mockedUseRouterPush).toHaveBeenCalledWith("/");
});

describe.each(["現在のパスワード", "新しいパスワード", "新しいパスワード（確認）"])("%sテキストボックス", (textBox) => {
    test("正しい形式のパスワードを入力した時、エラーメッセージが表示されない", async () => {
        await user.type(await screen.findByLabelText(textBox), "example01");

        await waitFor(() => {
            expect(screen.queryByRole("alert")).toBeNull();
        });
    });

    test("パスワードが未入力の時、「パスワードを入力してください」が表示される", async () => {
        await user.type(await screen.findByLabelText(textBox), "example01");
        await user.clear(await screen.findByLabelText(textBox));

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("パスワードを入力してください")).toBeTruthy();
        });
    });

    test("パスワードが6文字以下の時、「パスワードは7文字以上で入力してください」が表示される", async () => {
        await user.type(await screen.findByLabelText(textBox), "123456");

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("パスワードは7文字以上で入力してください")).toBeTruthy();
        });
    });

    test("パスワードに数字が含まれていない時、「パスワードには数字を含める必要があります」が表示される", async () => {
        await user.type(await screen.findByLabelText(textBox), "wordless");

        await waitFor(() => {
            expect(
                within(screen.getByRole("alert")).getByText("パスワードには数字を含める必要があります")
            ).toBeTruthy();
        });
    });
});

test("新しいパスワードと確認用パスワードが一致しない時、「新しいパスワードと一致しません」が表示される", async () => {
    await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
    await user.type(await screen.findByLabelText("新しいパスワード（確認）"), "example02");

    await waitFor(() => {
        expect(within(screen.getByRole("alert")).getByText("新しいパスワードと一致しません")).toBeTruthy();
    });
});

describe("パスワード変更ボタン押下時", () => {
    test.todo("パスワード変更APIを呼び出す");

    test.todo("パスワード変更完了画面に遷移する");

    describe.each(["現在のパスワード", "新しいパスワード", "新しいパスワード（確認）"])(
        "%sテキストボックス",
        (textBox) => {
            describe(textBox, () => {
                describe("未入力の時", () => {
                    test.todo("パスワード変更APIを呼び出さない");

                    test.todo("パスワード変更完了画面に遷移しない");
                });

                describe("パスワードが6文字以下の時", () => {
                    test.todo("パスワード変更APIを呼び出さない");

                    test.todo("パスワード変更完了画面に遷移しない");
                });

                describe("パスワードに数字が含まれていない時", () => {
                    test.todo("パスワード変更APIを呼び出さない");

                    test.todo("パスワード変更完了画面に遷移しない");
                });
            });
        }
    );

    describe("新しいパスワードと確認用パスワードが一致しない時", () => {
        test.todo("パスワード変更APIを呼び出さない");

        test.todo("パスワード変更完了画面に遷移しない");
    });
});
