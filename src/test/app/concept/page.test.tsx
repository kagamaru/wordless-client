// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "../vitest.setup";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import ConceptPage from "@/app/(main)/concept/page";
import {
    ErrorBoundary,
    PageTemplate,
    ProviderTemplate,
    UserInfoTemplate,
    WebSocketProvider
} from "@/components/template";
import { useEmoteStore } from "@/store";

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

const server = setupServer(
    http.get("http://localhost:3000/api/userSub/:userSub", () => {
        return HttpResponse.json({
            userId: "@x",
            userName: "User X",
            userAvatarUrl: "https://image.test/x.png"
        });
    })
);

beforeAll(() => {
    server.listen();
});

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
    useEmoteStore.getState().cleanAllData();
});

afterAll(() => {
    server.close();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoTemplate>
                    <WebSocketProvider>
                        <PageTemplate>
                            <ConceptPage />
                        </PageTemplate>
                    </WebSocketProvider>
                </UserInfoTemplate>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

test("作者GitHubボタンをクリックしたら、GitHubのリポジトリページが別タブで開かれる", async () => {
    rendering();
    const authorGitHubButton = screen.getByRole("button", { name: "github 作者GitHub" });

    user.click(authorGitHubButton);

    await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("https://github.com/kagamaru?tab=repositories", "_blank");
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
