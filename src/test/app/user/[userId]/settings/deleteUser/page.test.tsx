// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { User } from "@/@types";
import DeleteUser from "@/app/(main)/user/[userId]/settings/deleteUser/page";
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
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouterPush
    }),
    useParams: () => ({
        userId: "@x"
    })
}));

const mockDeleteUser = vi.fn();
const mockDeleteCognitoUser = vi.fn();
const server = setupServer(
    http.delete("http://localhost:3000/api/user/:userId", () => {
        mockDeleteUser();
        return HttpResponse.json({});
    }),
    http.delete("http://localhost:3000/api/cognito/deleteUser", () => {
        mockDeleteCognitoUser();
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
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
});

afterAll(() => {
    server.close();
});

const rendering = (userInfo?: User): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoContext.Provider
                    value={{
                        userInfo: userInfo ?? {
                            userId: "@x",
                            userName: "UserX",
                            userAvatarUrl: "https://image.test/x.png"
                        }
                    }}
                >
                    <WebSocketProvider>
                        <DeleteUser />
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    beforeEach(async () => {
        rendering();
    });

    test("トップ画面に戻るボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "トップ画面に戻る" })).toBeTruthy();
    });

    test("アカウント削除ボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "削除する" })).toBeTruthy();
    });
});

describe("アカウント削除ボタン押下時", () => {
    describe("正常時", () => {
        beforeEach(async () => {
            rendering();
        });

        test("アカウント削除ボタンをクリックした時、ローディングアイコンを表示する", async () => {
            server.use(
                http.delete("http://localhost:3000/api/user/:userId", () => {
                    return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
                })
            );

            await user.click(await screen.findByRole("button", { name: "削除する" }));

            await waitFor(() => {
                expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
            });
        });

        test("アカウント削除APIが呼ばれる", async () => {
            await user.click(await screen.findByRole("button", { name: "削除する" }));

            await waitFor(() => {
                expect(mockDeleteUser).toHaveBeenCalled();
            });
        });

        test("AWS Cognitoのユーザーを削除する", async () => {
            await user.click(await screen.findByRole("button", { name: "削除する" }));

            await waitFor(() => {
                expect(mockDeleteCognitoUser).toHaveBeenCalled();
            });
        });

        test("アカウント削除完了画面に遷移する", async () => {
            await user.click(await screen.findByRole("button", { name: "削除する" }));

            await waitFor(() => {
                expect(mockedUseRouterPush).toHaveBeenCalledWith("/deleteUser/completion");
            });
        });
    });

    describe("異常時", () => {
        beforeEach(async () => {
            rendering();
        });

        describe.each([
            ["USE-41", "不正なリクエストです。もう一度やり直してください。"],
            ["USE-42", "サンプルユーザーは削除できません。"],
            ["USE-43", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
            ["USE-44", "指定したユーザーは存在しません。"],
            ["USE-45", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
            ["USE-46", "指定したユーザーは存在しません。"],
            ["USE-47", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
        ])("アカウント削除APIで%sエラーが発生した時", (errorCode, errorMessage) => {
            beforeEach(async () => {
                server.use(
                    http.delete("http://localhost:3000/api/user/:userId", () => {
                        return HttpResponse.json({ data: errorCode }, { status: 400 });
                    })
                );
            });

            test("エラーメッセージを表示する", async () => {
                await user.click(await screen.findByRole("button", { name: "削除する" }));

                await waitFor(() => {
                    expect(screen.getByRole("alert")).toBeTruthy();
                    expect(within(screen.getByRole("alert")).getByText(`Error : ${errorCode}`)).toBeTruthy();
                    expect(within(screen.getByRole("alert")).getByText(errorMessage as string)).toBeTruthy();
                });
            });
        });

        describe("Cognitoのユーザー削除に失敗した時", () => {
            test("エラーメッセージを表示する", async () => {
                server.use(
                    http.delete("http://localhost:3000/api/cognito/deleteUser", () => {
                        return HttpResponse.json({ data: "COG-08" }, { status: 400 });
                    })
                );

                await user.click(await screen.findByRole("button", { name: "削除する" }));

                await waitFor(() => {
                    expect(screen.getByRole("alert")).toBeTruthy();
                    expect(within(screen.getByRole("alert")).getByText("Error : COG-08")).toBeTruthy();
                    expect(
                        within(screen.getByRole("alert")).getByText(
                            "ユーザーの削除に失敗しました。管理者にお問い合わせください。"
                        )
                    ).toBeTruthy();
                });
            });
        });
    });
});

test("トップ画面に戻るボタン押下時、トップ画面に遷移する", async () => {
    rendering();

    await user.click(await screen.findByRole("button", { name: "トップ画面に戻る" }));

    expect(mockedUseRouterPush).toHaveBeenCalledWith("/");
});
