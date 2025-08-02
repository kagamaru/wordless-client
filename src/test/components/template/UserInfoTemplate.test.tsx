import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ErrorBoundary, ProviderTemplate, UserInfoTemplate } from "@/components/template";
import { vitestSetup } from "@/test/app/vitest.setup";

vitestSetup();

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
                    <></>
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
});

afterAll(() => {
    server.close();
});

describe("UserInfoTemplate", () => {
    test("UserInfoの取得中、ローディングスピナーを表示する", async () => {
        server.use(
            http.get("http://localhost:3000/api/userSub/:userSub", () => {
                return new Promise(() => {});
            })
        );

        rendering();

        await waitFor(() => {
            expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
        });
    });

    test("localStorageからのIdToken取得に失敗した時、リダイレクトする", async () => {
        vi.stubGlobal("localStorage", {
            getItem: vi.fn().mockReturnValue(null)
        });

        rendering();

        await waitFor(() => {
            expect(mockedUseRouter).toHaveBeenCalledWith("/auth/login");
        });
    });
});
