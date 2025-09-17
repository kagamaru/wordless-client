// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import RegistrationConfirmationCodePage from "@/app/auth/registration/confirmationCode/page";
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

const mockConfirmSignup = vi.fn();
const server = setupServer(
    http.post("http://localhost:3000/api/cognito/confirmSignup", () => {
        mockConfirmSignup();
        return HttpResponse.json({});
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    rendering();
    useAuthInfoStore.getState().setAuthInfo({ email: "example@example.com", password: "password" });
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <RegistrationConfirmationCodePage />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("確認コードテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByLabelText("確認コード")).toBeTruthy();
        });
    });

    test("確認コード検証ボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "確認コードを検証" })).toBeTruthy();
        });
    });
});

describe("確認コード入力時", () => {
    test("確認コードとして正しい形式である場合、何もしない", async () => {
        await user.type(await screen.findByLabelText("確認コード"), "123456");
        await user.tab();

        await waitFor(() => {
            expect(screen.queryByRole("alert")).toBeNull();
        });
    });

    test("確認コードが入力されていない場合、「確認コードを入力してください」を表示する", async () => {
        await user.type(await screen.findByLabelText("確認コード"), "123456");
        await user.clear(await screen.findByLabelText("確認コード"));
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("確認コードを入力してください")).toBeTruthy();
        });
    });

    test("確認コードが数値でない場合、「確認コードは数値のみ入力してください」を表示する", async () => {
        await user.type(await screen.findByLabelText("確認コード"), "example");
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("確認コードは数値のみ入力してください")).toBeTruthy();
        });
    });
});

describe("確認コード検証ボタン押下時", () => {
    describe("確認コードが正しいものである時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByLabelText("確認コード"), "123456");
            await user.click(await screen.findByRole("button", { name: "確認コードを検証" }));
        });

        test("確認コード検証APIを呼び出す", async () => {
            await waitFor(() => {
                expect(mockConfirmSignup).toHaveBeenCalledTimes(1);
            });
        });

        test("ユーザー名登録画面に遷移する", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).toHaveBeenCalledWith("/auth/registration/userInfo");
            });
        });
    });

    describe("確認コードが入力されていない時、", () => {
        beforeEach(async () => {
            await user.click(await screen.findByRole("button", { name: "確認コードを検証" }));
        });

        test("確認コード検証APIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockConfirmSignup).toHaveBeenCalledTimes(0);
            });
        });

        test("ユーザー名登録画面に遷移しない", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/userInfo");
            });
        });
    });

    describe("確認コードが数値でない時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByLabelText("確認コード"), "example");
            await user.click(await screen.findByRole("button", { name: "確認コードを検証" }));
        });

        test("確認コード検証APIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockConfirmSignup).toHaveBeenCalledTimes(0);
            });
        });

        test("ユーザー名登録画面に遷移しない", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/userInfo");
            });
        });
    });

    describe("確認コード検証APIがエラーを返す時、", () => {
        beforeEach(async () => {
            server.use(
                http.post("http://localhost:3000/api/cognito/confirmSignup", () => {
                    return HttpResponse.json({}, { status: 400 });
                })
            );

            await user.type(await screen.findByLabelText("確認コード"), "123456");
            await user.click(await screen.findByRole("button", { name: "確認コードを検証" }));
        });

        test("確認コード検証APIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockConfirmSignup).toHaveBeenCalledTimes(0);
            });
        });

        test("ユーザー名登録画面に遷移しない", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/registration/userInfo");
            });
        });

        test("エラーメッセージを表示する", async () => {
            await waitFor(() => {
                const alertComponent = screen.getByRole("alert");
                expect(within(alertComponent).getByText("Error : COG-06")).toBeTruthy();
                expect(within(alertComponent).getByText("確認コードが不正です。")).toBeTruthy();
            });
        });
    });
});
