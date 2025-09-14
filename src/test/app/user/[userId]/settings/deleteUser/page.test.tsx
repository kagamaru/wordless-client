// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { User } from "@/@types";
import DeleteUser from "@/app/(main)/user/[userId]/settings/deleteUser/page";
import { ErrorBoundary, ProviderTemplate, UserInfoContext, WebSocketProvider } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

vi.mock("@/app/api/_WebSocketService", async () => {
    return {
        WebSocketService: class {
            onReact = vi.fn(() => {});
            onPostEmote = vi.fn(() => {});
        }
    };
});

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

const rendering = (userInfo?: User): void => {
    render(
        <ProviderTemplate>
            <ErrorBoundary>
                <UserInfoContext.Provider
                    value={{
                        userInfo: userInfo ?? {
                            userId: "@x",
                            userName: "UserX",
                            userAvatarUrl: "https://image.test/x.png"
                        }
                    }}
                >
                    <WebSocketProvider>
                        <DeleteUser />
                    </WebSocketProvider>
                </UserInfoContext.Provider>
            </ErrorBoundary>
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    beforeEach(async () => {
        rendering();
    });

    test("トップ画面に戻るボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "トップ画面に戻る" })).toBeTruthy();
    });

    test("アカウント削除ボタンを表示する", async () => {
        expect(await screen.findByRole("button", { name: "削除する" })).toBeTruthy();
    });
});

test("トップ画面に戻るボタン押下時、トップ画面に遷移する", async () => {
    rendering();

    await user.click(await screen.findByRole("button", { name: "トップ画面に戻る" }));

    expect(mockedUseRouterPush).toHaveBeenCalledWith("/");
});
