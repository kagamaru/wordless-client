// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DeleteUserCompletion from "@/app/(pages)/(deleteUser)/deleteUser/completion/page";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouterPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouterPush
    }),
    useParams: () => ({
        userId: "@x"
    })
}));

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
    cleanup();
});

const rendering = (): void => {
    render(<DeleteUserCompletion />);
};

describe("初期表示時", () => {
    beforeEach(async () => {
        rendering();
    });

    test("ログイン画面に戻るボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "logout ログイン画面に戻る" })).toBeTruthy();
    });
});

test("ログイン画面に戻るボタン押下時、ログイン画面に遷移する", async () => {
    rendering();

    await user.click(await screen.findByRole("button", { name: "logout ログイン画面に戻る" }));

    expect(mockedUseRouterPush).toHaveBeenCalledWith("/auth/login");
});
