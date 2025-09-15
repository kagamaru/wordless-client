// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import NewPasswordInputPage from "@/app/auth/forgetPassword/newPasswordInput/page";
import { ProviderTemplate } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

const mockConfirmForgotPassword = vi.fn();
const server = setupServer(
    http.post("http://localhost:3000/api/cognito/confirmForgotPassword", () => {
        mockConfirmForgotPassword();
        return HttpResponse.json({});
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
            <NewPasswordInputPage />
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

    test("新しいパスワードテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByLabelText("新しいパスワード")).toBeTruthy();
        });
    });

    test("確認コードテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByLabelText("確認コード")).toBeTruthy();
        });
    });

    test("パスワード変更ボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "パスワード変更" })).toBeTruthy();
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

describe("新しいパスワード入力時", () => {
    beforeEach(() => {
        rendering();
    });

    test("新しいパスワードとして正しい形式である場合、何もしない", async () => {
        await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
        await user.tab();

        await waitFor(() => {
            expect(screen.queryByRole("alert")).toBeNull();
        });
    });

    test("新しいパスワードが入力されていない場合、「パスワードを入力してください」を表示する", async () => {
        await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
        await user.clear(await screen.findByLabelText("新しいパスワード"));

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("パスワードを入力してください")).toBeTruthy();
        });
    });

    test("新しいパスワードが6文字以下の場合、「パスワードは7文字以上で入力してください」を表示する", async () => {
        await user.type(await screen.findByLabelText("新しいパスワード"), "123456");
        await user.tab();

        await waitFor(() => {
            expect(within(screen.getByRole("alert")).getByText("パスワードは7文字以上で入力してください")).toBeTruthy();
        });
    });

    test("新しいパスワードに数字が含まれていない場合、「パスワードには数字を含める必要があります」を表示する", async () => {
        await user.type(await screen.findByLabelText("新しいパスワード"), "wordless");
        await user.tab();

        await waitFor(() => {
            expect(
                within(screen.getByRole("alert")).getByText("パスワードには数字を含める必要があります")
            ).toBeTruthy();
        });
    });
});

describe("確認コード入力時", () => {
    beforeEach(() => {
        rendering();
    });

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

describe("パスワード変更ボタン押下時", () => {
    describe("Eメール、新しいパスワード、確認コードが正しく入力されている時", () => {
        beforeEach(async () => {
            rendering();

            await user.type(await screen.findByLabelText("Eメール"), "example@example.com");
            await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
            await user.type(await screen.findByLabelText("確認コード"), "123456");

            await user.click(screen.getByRole("button", { name: "パスワード変更" }));
        });

        test("パスワード変更APIを呼び出す", async () => {
            expect(mockConfirmForgotPassword).toHaveBeenCalled();
        });

        test("パスワード変更完了画面に遷移する", async () => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/auth/forgetPassword/completion");
        });
    });

    describe("Eメールが正しく入力されていない時", () => {
        beforeEach(async () => {
            rendering();

            await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
            await user.type(await screen.findByLabelText("確認コード"), "123456");
        });

        describe("Eメールが入力されていない時", () => {
            beforeEach(async () => {
                await user.clear(await screen.findByLabelText("Eメール"));

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });

        describe("Eメールとして正しい形式でない時", () => {
            beforeEach(async () => {
                await user.type(await screen.findByLabelText("Eメール"), "example@");

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });
    });

    describe("新しいパスワードが正しく入力されていない時", () => {
        beforeEach(async () => {
            rendering();

            await user.type(await screen.findByLabelText("Eメール"), "example@example.com");
            await user.type(await screen.findByLabelText("確認コード"), "123456");

            await user.click(screen.getByRole("button", { name: "パスワード変更" }));
        });

        describe("新しいパスワードが入力されていない時", () => {
            beforeEach(async () => {
                await user.clear(await screen.findByLabelText("新しいパスワード"));

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });

        describe.each([
            ["6文字以下", "123456"],
            ["数字が含まれていない", "wordless"]
        ])("新しいパスワードが%sの時", (_, newPassword) => {
            beforeEach(async () => {
                await user.type(await screen.findByLabelText("新しいパスワード"), newPassword);

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });
    });

    describe("確認コードが正しく入力されていない時", () => {
        beforeEach(async () => {
            rendering();

            await user.type(await screen.findByLabelText("Eメール"), "example@example.com");
            await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
        });

        describe("確認コードが入力されていない時", () => {
            beforeEach(async () => {
                await user.clear(await screen.findByLabelText("確認コード"));

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });

        describe("確認コードが数値でない時", () => {
            beforeEach(async () => {
                await user.type(await screen.findByLabelText("確認コード"), "example");

                await user.click(screen.getByRole("button", { name: "パスワード変更" }));
            });

            test("パスワード変更APIを呼び出さない", async () => {
                expect(mockConfirmForgotPassword).not.toHaveBeenCalled();
            });

            test("パスワード変更完了画面に遷移しない", async () => {
                expect(mockedUseRouter).not.toHaveBeenCalledWith("/auth/forgetPassword/completion");
            });
        });
    });

    test("パスワード変更APIでエラーが返却された時、エラーメッセージを表示する", async () => {
        server.use(
            http.post("http://localhost:3000/api/cognito/confirmForgotPassword", () => {
                return HttpResponse.json({}, { status: 400 });
            })
        );
        rendering();

        await user.type(await screen.findByLabelText("Eメール"), "example@example.com");
        await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
        await user.type(await screen.findByLabelText("確認コード"), "123456");

        await user.click(screen.getByRole("button", { name: "パスワード変更" }));

        expect(within(screen.getByRole("alert")).getByText("Error : COG-04")).toBeTruthy();
        expect(within(screen.getByRole("alert")).getByText("確認コードかメールアドレスが不正です。")).toBeTruthy();
    });

    test.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
        "サンプルユーザーのメールアドレスを入力した時、エラーメッセージを表示する",
        async (email) => {
            rendering();

            await user.type(await screen.findByLabelText("Eメール"), email);
            await user.type(await screen.findByLabelText("新しいパスワード"), "example01");
            await user.type(await screen.findByLabelText("確認コード"), "123456");

            await user.click(screen.getByRole("button", { name: "パスワード変更" }));

            expect(within(screen.getByRole("alert")).getByText("Error : COG-04")).toBeTruthy();
            expect(within(screen.getByRole("alert")).getByText("確認コードかメールアドレスが不正です。")).toBeTruthy();
        }
    );
});

test("ログイン画面に戻るボタン押下時、ログイン画面に遷移する", async () => {
    rendering();
    const backLoginButton = await screen.findByRole("button", { name: "ログイン画面に戻る" });

    await user.click(backLoginButton);

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
    });
});
