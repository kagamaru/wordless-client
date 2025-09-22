// NOTE: vitestSetupは他のimportよりも先に呼び出す必要がある
// NOTE: import順が変わるとモックが効かなくなるため、必ずこの位置に記述する
import { vitestSetup } from "@/test/app/vitest.setup";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import RegistrationUserIconPage from "@/app/auth/registration/[userId]/userIcon/page";
import { ProviderTemplate } from "@/components/template";

vitestSetup();
const user = userEvent.setup();

const mockedUseRouter = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockedUseRouter
    }),
    useParams: () => ({
        userId: "@user1"
    })
}));

const mockFetchUserInfo = vi.fn();
const mockPostUserImage = vi.fn();
const server = setupServer(
    http.get("http://localhost:3000/api/user/:userId", () => {
        mockFetchUserInfo();
        return HttpResponse.json({
            userId: "@user1",
            userName: "UserOne",
            userAvatarUrl: "https://image.test/user1.png"
        });
    }),
    http.post("http://localhost:3000/api/userImage/:userId", () => {
        mockPostUserImage();
        return HttpResponse.json({});
    })
);

beforeAll(() => {
    server.listen();
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
});

const rendering = (): void => {
    render(
        <ProviderTemplate>
            <RegistrationUserIconPage />
        </ProviderTemplate>
    );
};

describe("初期表示時", () => {
    test("ユーザーのプロフィール画像を表示する", async () => {
        rendering();

        expect(await screen.findByRole("img", { name: "UserOneのユーザー画像" })).toBeTruthy();
    });

    test("ユーザー画像変更ボタンを表示する", async () => {
        rendering();

        expect(await screen.findByRole("button", { name: "sync 画像を変更する" })).toBeTruthy();
    });

    test("Wordlessを始めるボタンを表示する", async () => {
        rendering();

        expect(await screen.findByRole("button", { name: "Wordlessを始める" })).toBeTruthy();
    });

    describe.each([
        ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
    ])("ユーザー情報取得APIで%sエラーが返却された時", (errorCode, errorMessage) => {
        test("エラーメッセージを表示する", async () => {
            server.use(
                http.get("http://localhost:3000/api/user/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );
            rendering();

            await waitFor(() => {
                expect(screen.getByRole("alert")).toBeTruthy();
                expect(within(screen.getByRole("alert")).getByText(errorMessage)).toBeTruthy();
            });
        });
    });
});

describe("画像を変更するボタン押下時", () => {
    async function uploadImage() {
        await user.click(await screen.findByRole("button", { name: "sync 画像を変更する" }));
        await user.upload(
            screen.getByTestId("file-input-change-image-button"),
            new File(["test"], "test.png", { type: "image/png" })
        );
    }

    test("ローディングアイコンを表示する", async () => {
        rendering();
        server.use(
            http.post("http://localhost:3000/api/userImage/:userId", () => {
                return new Promise(() => {}); // NOTE: 永続的にローディング状態を維持
            })
        );

        await uploadImage();

        await waitFor(() => {
            expect(screen.getByRole("img", { name: "loading" })).toBeTruthy();
        });
    });

    test("ユーザー画像登録APIを呼び出す", async () => {
        rendering();

        await uploadImage();

        await waitFor(() => {
            expect(mockPostUserImage).toHaveBeenCalled();
        });
    });

    test("ユーザー情報取得APIを呼び出す", async () => {
        rendering();

        await uploadImage();

        await waitFor(() => {
            expect(mockFetchUserInfo).toHaveBeenCalled();
        });
    });

    describe.each([
        ["IMG-01", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-02", "サンプルユーザーはプロフィール画像を変えることが出来ません。"],
        ["IMG-03", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-04", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-05", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-06", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["IMG-07", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-08", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["IMG-09", "エラーが発生しています。しばらくの間使用できない可能性があります。"],
        ["IMG-91", "不正なリクエストです。もう一度やり直してください。"],
        ["IMG-92", "サンプルユーザーはプロフィール画像を変えることが出来ません。"],
        ["IMG-93", "画像データがありません。"],
        ["IMG-94", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
    ])("ユーザー画像登録APIで%sエラーが返却された時", (errorCode, errorMessage) => {
        test("エラーメッセージを表示する", async () => {
            server.use(
                http.post("http://localhost:3000/api/userImage/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );
            rendering();

            await uploadImage();

            await waitFor(() => {
                expect(screen.getByRole("alert")).toBeTruthy();
                expect(within(screen.getByRole("alert")).getByText(errorMessage)).toBeTruthy();
            });
        });
    });

    describe.each([
        ["USE-01", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-02", "不正なリクエストです。もう一度やり直してください。"],
        ["USE-03", "エラーが発生しています。しばらくの間使用できない可能性があります。"]
    ])("ユーザー情報取得APIで%sエラーが返却された時", (errorCode, errorMessage) => {
        test("エラーメッセージを表示する", async () => {
            rendering();
            server.use(
                http.get("http://localhost:3000/api/user/:userId", () => {
                    return HttpResponse.json({ data: errorCode }, { status: 400 });
                })
            );

            await uploadImage();

            await waitFor(() => {
                expect(screen.getByRole("alert")).toBeTruthy();
                expect(within(screen.getByRole("alert")).getByText(errorMessage)).toBeTruthy();
            });
        });
    });
});

describe("Wordlessを始めるボタン押下時", () => {
    test("トップ画面に遷移する", async () => {
        rendering();

        await user.click(await screen.findByRole("button", { name: "Wordlessを始める" }));

        expect(mockedUseRouter).toHaveBeenCalledWith("/");
    });
});
