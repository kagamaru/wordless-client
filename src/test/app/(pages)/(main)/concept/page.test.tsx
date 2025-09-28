// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import ConceptPage from "@/app/(pages)/(main)/concept/page";
import {
    ErrorBoundary,
    PageTemplate,
    ProviderTemplate,
    UserInfoContext,
    WebSocketProvider
} from "@/components/template";

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

const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

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
                            <ConceptPage />
                        </PageTemplate>
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

test("作者GitHubボタンをクリックしたら、GitHubのリポジトリページが別タブで開かれる", async () => {
    rendering();
    const authorGitHubButton = screen.getByRole("button", { name: "github 作者GitHub" });

    user.click(authorGitHubButton);

    await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("https://github.com/kagamaru/my-profile", "_blank");
    });
});
test("トップページへボタンをクリックしたら、トップページにリダイレクトされる", async () => {
    rendering();
    const topPageButton = screen.getByRole("button", { name: "トップページへ" });

    user.click(topPageButton);

    await waitFor(() => {
        expect(mockedUseRouter).toHaveBeenCalledWith("/");
    });
});
