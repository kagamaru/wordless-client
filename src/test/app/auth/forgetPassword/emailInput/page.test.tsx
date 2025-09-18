// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ProviderTemplate } from "@/components/template";
import EmailAddressInputPage from "@/app/auth/forgetPassword/emailInput/page";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

const mockForgotPassword = vi.fn();
const server = setupServer(
    http.post("http://localhost:3000/api/cognito/forgotPassword", () => {
        mockForgotPassword();
        return HttpResponse.json({
            CodeDeliveryDetails: {
                AttributeName: "email",
                DeliveryMedium: "EMAIL",
                Destination: "test@example.com"
            }
        });
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
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
            <EmailAddressInputPage />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    beforeEach(() => {
        rendering();
    });

    test("Eメールテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("textbox", { name: "Eメール" })).toBeTruthy();
        });
    });

    test("パスワードリセットメール送信ボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "send メール送信" })).toBeTruthy();
        });
    });

    test("ログイン画面に戻るボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "ログイン画面に戻る" })).toBeTruthy();
        });
    });
});

describe("Eメール入力時", () => {
    beforeEach(() => {
        rendering();
    });

    test("Eメールとして正しい形式である場合、何もしない", async () => {
        await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");
        await user.tab();

        await waitFor(() => {
            expect(screen.queryByRole("alert")).toBeNull();
        });
    });

    test("Eメールが入力されていない場合、「Eメールを入力してください」を表示する", async () => {
        await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");
        await user.clear(await screen.findByRole("textbox", { name: "Eメール" }));

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("Eメールを入力してください")).toBeTruthy();
        });
    });

    test("Eメールとして正しい形式でない場合、「有効なEメールを入力してください」を表示する", async () => {
        await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@");
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("有効なEメールを入力してください")).toBeTruthy();
        });
    });
});

describe("パスワードリセットメール送信ボタン押下時", () => {
    beforeEach(() => {
        rendering();
    });

    describe("Eメールが入力されている時、", () => {
        test("パスワードリセットメール送信APIを呼び出す", async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "test@example.com");
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockForgotPassword).toHaveBeenCalledTimes(1);
            });
        });

        test("新規パスワード入力画面に遷移する", async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "test@example.com");
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockedUseRouter).toHaveBeenCalledWith("/auth/forgetPassword/newPasswordInput");
            });
        });
    });

    describe("Eメールが入力されていない時、", () => {
        test("パスワードリセットメール送信APIを呼び出さない", async () => {
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockForgotPassword).not.toHaveBeenCalled();
            });
        });

        test("新規パスワード入力画面に遷移しない", async () => {
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/newPasswordInput");
            });
        });
    });

    describe("Eメールとして正しい形式でない時、", () => {
        test("パスワードリセットメール送信APIを呼び出さない", async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@");
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockForgotPassword).not.toHaveBeenCalled();
            });
        });

        test("新規パスワード入力画面に遷移しない", async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@");
            await user.click(await screen.findByRole("button", { name: "send メール送信" }));

            await waitFor(() => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/newPasswordInput");
            });
        });
    });

    describe.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
        "サンプルユーザーのメールアドレスを入力した時、",
        async (email) => {
            test("パスワードリセットメール送信APIを呼び出さない", async () => {
                await user.type(await screen.findByRole("textbox", { name: "Eメール" }), email);
                await user.click(await screen.findByRole("button", { name: "send メール送信" }));

                await waitFor(() => {
                    expect(mockForgotPassword).not.toHaveBeenCalled();
                });
            });

            test("新規パスワード入力画面に遷移しない", async () => {
                await user.type(await screen.findByRole("textbox", { name: "Eメール" }), email);
                await user.click(await screen.findByRole("button", { name: "send メール送信" }));

                await waitFor(() => {
                    expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/newPasswordInput");
                });
            });

            test("「登録されていないメールアドレスか、サンプルユーザーのメールアドレスです。」を表示する", async () => {
                await user.type(await screen.findByRole("textbox", { name: "Eメール" }), email);
                await user.click(await screen.findByRole("button", { name: "send メール送信" }));

                await waitFor(() => {
                    expect(
                        within(screen.getByRole("alert")).getByText(
                            "登録されていないメールアドレスか、サンプルユーザーのメールアドレスです。"
                        )
                    ).toBeTruthy();
                });
            });
        }
    );

    test("パスワードを忘れた場合APIでエラーが発生した時、「登録されていないメールアドレスか、サンプルユーザーのメールアドレスです。」を表示する", async () => {
        server.use(
            http.post("http://localhost:3000/api/cognito/forgotPassword", () => {
                return HttpResponse.json({}, { status: 400 });
            })
        );

        await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "test@example.com");
        await user.click(await screen.findByRole("button", { name: "send メール送信" }));

        await waitFor(() => {
            expect(
                within(screen.getByRole("alert")).getByText(
                    "登録されていないメールアドレスか、サンプルユーザーのメールアドレスです。"
                )
            ).toBeTruthy();
        });
    });
});

test("ログイン画面に戻るボタン押下時、ログイン画面に遷移する", async () => {
    rendering();
    const backLoginButton = await screen.findByRole("button", { name: "ログイン画面に戻る" });

    await user.click(backLoginButton);

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
    });
});
