import { NewDeviceMetadataType } from "@aws-sdk/client-cognito-identity-provider";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { vitestSetup } from "../../vitest.setup";
import LoginSignup from "@/app/auth/login/page";
import { ProviderTemplate } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockSignin = vi.fn();

const server = setupServer(
    http.post("http://localhost:3000/api/auth", () => {
        mockSignin();
        return HttpResponse.json({
            AccessToken: "mock-access-token",
            IdToken: "mock-id-token",
            RefreshToken: "mock-refresh-token",
            ExpiresIn: 3600,
            TokenType: "Bearer",
            NewDeviceMetadata: {
                DeviceKey: "mock-device-key",
                DeviceGroupKey: "mock-device-group-key"
            } as NewDeviceMetadataType
        });
    })
);

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

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
            <LoginSignup />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    beforeEach(() => {
        rendering();
    });

    test("ログインタブが選択されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("tab", { name: "ログイン", selected: true })).toBeTruthy();
        });
    });

    test("Eメールテキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("textbox", { name: "Eメール" })).toBeTruthy();
        });
    });

    test("パスワード入力テキストボックスが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByLabelText("パスワード")).toBeTruthy();
        });
    });

    test("ログインボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "ログイン" })).toBeTruthy();
        });
    });

    test("パスワードを忘れた場合ボタンが表示されている", async () => {
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "パスワードを忘れた場合" })).toBeTruthy();
        });
    });
});

describe("ユーザー登録タブ押下時", () => {
    beforeEach(async () => {
        rendering();

        await waitFor(async () => {
            await user.click(screen.getByRole("tab", { name: "ユーザー登録", selected: false }));
        });
    });

    test("ユーザー登録タブが選択されている", () => {
        expect(screen.getByRole("tab", { name: "ユーザー登録", selected: true })).toBeTruthy();
    });

    test("Eメールテキストボックスが表示されている", () => {
        expect(screen.getByRole("textbox", { name: "Eメール" })).toBeTruthy();
    });

    test("パスワード入力テキストボックスが表示されている", () => {
        expect(screen.getByLabelText("パスワード")).toBeTruthy();
    });

    test("ユーザー登録ボタンが表示されている", () => {
        expect(screen.getByRole("button", { name: "ユーザー登録" })).toBeTruthy();
    });

    test("パスワードを忘れた場合ボタンが表示されている", () => {
        expect(screen.getByRole("button", { name: "パスワードを忘れた場合" })).toBeTruthy();
    });

    test("ログインタブを押下した時、ログインタブを選択する", async () => {
        await user.click(screen.getByRole("tab", { name: "ログイン", selected: false }));

        expect(screen.getByRole("tab", { name: "ログイン", selected: true })).toBeTruthy();
    });
});

describe("ログインボタン押下時", () => {
    beforeEach(() => {
        rendering();
    });

    describe("Eメールとパスワードが両方正しいものである時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");
            await user.type(await screen.findByLabelText("パスワード"), "example01");

            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("ダッシュボード画面に遷移する", async () => {
            await waitFor(() => {
                expect(mockedUseRouter).toHaveBeenCalledWith("/");
            });
        });

        test("ログインAPIを呼び出す", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Eメールが入力されていない時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByLabelText("パスワード"), "example01");
            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("「Eメールを入力してください」を表示する", async () => {
            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("Eメールを入力してください")).toBeTruthy();
            });
        });

        test("ログインAPIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(0);
            });
        });

        test("正しいEメールを入力した時、「Eメールを入力してください」表示を消す", async () => {
            await user.type(screen.getByRole("textbox", { name: "Eメール" }), "example@example.com");

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeFalsy();
            });
        });
    });

    describe("Eメールとして正しい形式でない時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@");
            await user.type(await screen.findByLabelText("パスワード"), "example01");

            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("「有効なEメールを入力してください」を表示する", async () => {
            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("有効なEメールを入力してください")).toBeTruthy();
            });
        });

        test("ログインAPIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(0);
            });
        });

        test("正しいEメールを入力した時、「有効なEメールを入力してください」表示を消す", async () => {
            const emailInput = screen.getByRole("textbox", { name: "Eメール" });
            await user.clear(emailInput);

            await user.type(emailInput, "example@example.com");

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        });
    });

    describe("パスワードが入力されていない時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");

            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("「パスワードを入力してください」を表示する", async () => {
            await waitFor(() => {
                expect(within(screen.getByRole("alert")).getByText("パスワードを入力してください")).toBeTruthy();
            });
        });

        test("ログインAPIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(0);
            });
        });

        test("正しいパスワード入力した時、「パスワードを入力してください」表示を消す", async () => {
            const passwordInput = screen.getByLabelText("パスワード");
            await user.clear(passwordInput);

            await user.type(passwordInput, "example01");

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        });
    });

    describe("パスワードが6文字以下の時、", () => {
        beforeEach(async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");
            await user.type(await screen.findByLabelText("パスワード"), "ex01");

            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("「パスワードは7文字以上で入力してください」を表示する", async () => {
            await waitFor(() => {
                expect(
                    within(screen.getByRole("alert")).getByText("パスワードは7文字以上で入力してください")
                ).toBeTruthy();
            });
        });

        test("ログインAPIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(0);
            });
        });

        test("正しいパスワードを入力した時、「パスワードは7文字以上で入力してください」表示を消す", async () => {
            const passwordInput = screen.getByLabelText("パスワード");
            await user.clear(passwordInput);

            await user.type(passwordInput, "example01");

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        });
    });

    describe("パスワードに数字が含まれていない時", () => {
        beforeEach(async () => {
            await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "example@example.com");
            await user.type(await screen.findByLabelText("パスワード"), "wordless");

            await user.click(await screen.findByRole("button", { name: "ログイン" }));
        });

        test("「パスワードには数字を含める必要があります」を表示する", async () => {
            await waitFor(() => {
                expect(
                    within(screen.getByRole("alert")).getByText("パスワードには数字を含める必要があります")
                ).toBeTruthy();
            });
        });

        test("ログインAPIを呼び出さない", async () => {
            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledTimes(0);
            });
        });

        test("正しいパスワードを入力した時、「パスワードには数字を含める必要があります」表示を消す", async () => {
            const passwordInput = screen.getByLabelText("パスワード");
            await user.clear(passwordInput);

            await user.type(passwordInput, "example01");

            await waitFor(() => {
                expect(screen.queryByRole("alert")).toBeNull();
            });
        });
    });

    test("ログインAPIでエラーが返却された時、エラーメッセージを表示する", async () => {
        server.use(
            http.post("http://localhost:3000/api/auth", () => {
                return HttpResponse.json({ data: "AUN-01" }, { status: 401 });
            })
        );

        await user.type(await screen.findByRole("textbox", { name: "Eメール" }), "incorrect@example.com");
        await user.type(await screen.findByLabelText("パスワード"), "incorrect01");

        await user.click(await screen.findByRole("button", { name: "ログイン" }));

        const alertComponent = await screen.findByRole("alert");
        expect(within(alertComponent).getByText("Error : AUN-99")).toBeTruthy();
        expect(within(alertComponent).getByText("認証できませんでした。IDとパスワードをご確認ください。")).toBeTruthy();
    });
});

test.todo("ユーザー登録ボタン押下時");
