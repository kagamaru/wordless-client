// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ProviderTemplate } from "@/components/template";
import ForgetPasswordCompletionPage from "@/app/(pages)/auth/forgetPassword/completion/page";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    rendering();
});

afterEach(() => {
    cleanup();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <ForgetPasswordCompletionPage />
        </ProviderTemplate>
    );
};

test("初期表示時、ログイン画面に戻るボタンが表示されている", async () => {
    expect(await screen.findByRole("button", { name: "ログイン画面に戻る" })).toBeTruthy();
});

test("ログイン画面に戻るボタン押下時、ログイン画面に遷移する", async () => {
    const backLoginButton = await screen.findByRole("button", { name: "ログイン画面に戻る" });

    await user.click(backLoginButton);

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
    });
});
