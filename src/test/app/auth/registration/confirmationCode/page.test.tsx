// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import RegistrationConfirmationCodePage from "@/app/auth/registration/confirmationCode/page";
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
});

afterAll(() => {});

afterEach(() => {
    cleanup();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <RegistrationConfirmationCodePage />
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

describe("確認コード検証ボタン押下時", () => {
    describe("Eメールと確認コードが両方正しいものである時、", () => {
        test.todo("確認コード検証APIを呼び出す");

        test.todo("ユーザー名登録画面に遷移する");
    });

    describe("Eメールが入力されていない時、", () => {
        test.todo("確認コード検証APIを呼び出さない");

        test.todo("ユーザー名登録画面に遷移しない");
    });

    describe("Eメールが正しい形式でない時、", () => {
        test.todo("確認コード検証APIを呼び出さない");

        test.todo("ユーザー名登録画面に遷移しない");
    });

    describe("確認コードが入力されていない時、", () => {
        test.todo("確認コード検証APIを呼び出さない");

        test.todo("ユーザー名登録画面に遷移しない");
    });

    describe("確認コードが数値でない時、", () => {
        test.todo("確認コード検証APIを呼び出さない");

        test.todo("ユーザー名登録画面に遷移しない");
    });
});
