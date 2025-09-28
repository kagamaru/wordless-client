// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { describe } from "node:test";
import {
    ErrorBoundary,
    PageTemplate,
    ProviderTemplate,
    UserInfoContext,
    WebSocketProvider
} from "@/components/template";
import PasswordChangeCompletion from "@/app/(pages)/(main)/user/[userId]/settings/password/completion/page";

vitestSetup();
const user = userEvent.setup();

vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {}
    };
});

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    })
}));
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn((_token: string) => {
        return {
            sub: "mock-sub"
        };
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
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoContext.Provider
                    value={{
                        userInfo: { userId: "@x", userName: "User X", userAvatarUrl: "https://image.test/x.png" }
                    }}
                >
                    <WebSocketProvider>
                        <PageTemplate>
                            <PasswordChangeCompletion />
                        </PageTemplate>
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("トップ画面に戻るボタンを表示する", async () => {
        rendering();
        expect(await screen.findByRole("button", { name: "トップ画面に戻る" })).toBeTruthy();
    });
});

test("トップ画面に戻るボタン押下時、トップ画面に遷移する", async () => {
    rendering();
    await user.click(await screen.findByRole("button", { name: "トップ画面に戻る" }));

    expect(mockedUseRouter).toHaveBeenCalledWith("/");
});
