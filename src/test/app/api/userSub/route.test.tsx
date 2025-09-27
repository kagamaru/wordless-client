// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { GET } from "@/app/api/userSub/[userSub]/route";

const userApiUrl = "https://api.mock.test/v1/userSub/@test";

const server = setupServer(
    http.get(userApiUrl, () => {
        return HttpResponse.json({
            userId: "@test",
            userName: "TEST",
            userAvatarUrl: "https://image.test/d.png"
        });
    })
);

const token = "test-token";
const getRequestURL = new NextRequest(userApiUrl, {
    headers: {
        authorization: token
    }
});
const getRequestParams = {
    params: new Promise<{ userSub: string }>((resolve) => {
        resolve({
            userSub: "@test"
        });
    })
};

beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

const fetchUser = async (): Promise<NextResponse> => {
    return await GET(getRequestURL, getRequestParams);
};

describe("正常系", () => {
    test("status code 200を返す", async () => {
        const response = await fetchUser();

        expect(response.status).toBe(200);
    });

    test("ユーザー情報を返す", async () => {
        const response = await fetchUser();
        const data = await response.json();

        expect(data).toEqual({
            userId: "@test",
            userName: "TEST",
            userAvatarUrl: "https://image.test/d.png"
        });
    });
});

describe("異常系", () => {
    test("認証に失敗したとき、401を返す", async () => {
        server.use(
            http.get(userApiUrl, () => {
                return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
            })
        );

        const response = await fetchUser();
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({ data: "AUN-99" });
    });

    test("パラメータが不正なとき、400を返す", async () => {
        server.use(
            http.get(userApiUrl, () => {
                return HttpResponse.json({ error: "USE-11" }, { status: 400 });
            })
        );

        const response = await fetchUser();
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ data: "USE-11" });
    });

    test("サーバーに接続できないとき、500を返す", async () => {
        server.use(
            http.get(userApiUrl, () => {
                return HttpResponse.json({ error: "USE-13" }, { status: 500 });
            })
        );

        const response = await fetchUser();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toEqual({ data: "USE-13" });
    });
});
