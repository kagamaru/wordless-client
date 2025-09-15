// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import RegistrationUserInfoPage from "@/app/auth/registration/userInfo/page";
import { ProviderTemplate } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

beforeAll(() => {});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    rendering();
});

afterAll(() => {});

afterEach(() => {
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
