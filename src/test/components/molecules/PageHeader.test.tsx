import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { PageHeader } from "@/components/molecules";
import { ErrorBoundary, ProviderTemplate, UserInfoTemplate, WebSocketProvider } from "@/components/template";
import { useEmoteStore } from "@/store";
import { vitestSetup } from "@/test/app/vitest.setup";

vitestSetup();
const user = userEvent.setup();

vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {
            onReact = () => {};
            onEmote = () => {};
        }
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

const server = setupServer(
    http.get("http://localhost:3000/api/userSub/:userSub", () => {
        return HttpResponse.json({
            userId: "@x",
            userName: "User X",
            userAvatarUrl: "https://image.test/x.png"
        });
    })
);

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoTemplate>
                    <WebSocketProvider>
                        <PageHeader />
                    </WebSocketProvider>
                </UserInfoTemplate>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

beforeAll(() => {
    server.listen();
});

const removeItemMock = vi.fn();
beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.stubGlobal("localStorage", {
        getItem: vi.fn().mockReturnValue("mocked_id_token"),
        setItem: vi.fn(),
        removeItem: removeItemMock,
        clear: vi.fn()
    });
    rendering();
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
    useEmoteStore.getState().cleanAllData();
});

afterAll(() => {
    server.close();
});

describe("PageHeader", () => {
    test("ヘッダーをクリックした時、ダッシュボード画面に遷移する", async () => {
        await user.click(await screen.findByRole("heading", { name: "Wordless" }));

        expect(mockedUseRouter).toHaveBeenCalledWith("/");
    });

    test("ヘッダーメニューをクリックした時、メニューを表示する", async () => {
        await user.click(await screen.findByRole("img", { name: "menu" }));

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeTruthy();
        });
    });

    describe("メニュー表示時", () => {
        beforeEach(async () => {
            await user.click(await screen.findByRole("img", { name: "menu" }));
        });

        test("ユーザーのプロフィール画像を表示する", async () => {
            expect(screen.getByAltText("User XProfileImage")).toBeTruthy();
        });

        test("ユーザー名を表示する", async () => {
            expect(screen.getByText("User X")).toBeTruthy();
        });

        test("ユーザーIDを表示する", async () => {
            expect(screen.getByText("@x")).toBeTruthy();
        });

        test("ホームボタンクリック時、ダッシュボード画面に遷移する", async () => {
            await user.click(screen.getByRole("heading", { name: "ホーム" }));

            expect(mockedUseRouter).toHaveBeenCalledWith("/");
        });

        test("自分のページボタンをクリックした時、ユーザー情報ページに遷移する", async () => {
            await user.click(screen.getByRole("heading", { name: "自分のページ" }));

            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x");
        });

        test("コンセプトページボタンをクリックした時、コンセプトページに遷移する", async () => {
            await user.click(screen.getByRole("heading", { name: "コンセプト" }));

            expect(mockedUseRouter).toHaveBeenCalledWith("/concept");
        });

        test("ログアウトボタンをクリックした時、ログアウトする", async () => {
            await user.click(screen.getByRole("heading", { name: "ログアウト" }));

            expect(removeItemMock).toHaveBeenCalledWith("IdToken");
            expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
        });

        test("パスワード変更ボタンをクリックした時、パスワード変更ページに遷移する", async () => {
            await user.click(screen.getByRole("heading", { name: "パスワード変更" }));

            expect(mockedUseRouter).toHaveBeenCalledWith("/user/@x/settings/password");
        });

        test.todo("アカウント削除ボタンをクリックした時、アカウント削除ページに遷移する");

        test("×ボタン押下時、メニューを閉じる", async () => {
            await user.click(screen.getByRole("img", { name: "close" }));

            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });
});
