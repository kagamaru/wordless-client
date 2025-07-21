import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { GET } from "@/app/api/userSuki/[userId]/route";

const userApiUrl = "https://api.mock.test/v1/userSuki/@test";

const server = setupServer(
    http.get(userApiUrl, () => {
        return HttpResponse.json({
            userId: "@test",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
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
    params: new Promise<{ userId: string }>((resolve) => {
        resolve({
            userId: "@test"
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

const fetchUserSuki = async (): Promise<NextResponse> => {
    return await GET(getRequestURL, getRequestParams);
};

describe("正常系", () => {
    test("status code 200を返す", async () => {
        const response = await fetchUserSuki();

        expect(response.status).toBe(200);
    });

    test("ユーザー情報を返す", async () => {
        const response = await fetchUserSuki();
        const data = await response.json();

        expect(data).toEqual({
            userId: "@test",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
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

        const response = await fetchUserSuki();
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({ data: "AUN-99" });
    });

    test("パラメータが不正なとき、400を返す", async () => {
        server.use(
            http.get(userApiUrl, () => {
                return HttpResponse.json({ error: "USK-01" }, { status: 400 });
            })
        );

        const response = await fetchUserSuki();
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ data: "USK-01" });
    });

    test("サーバーに接続できないとき、500を返す", async () => {
        server.use(
            http.get(userApiUrl, () => {
                return HttpResponse.json({ error: "USK-03" }, { status: 500 });
            })
        );

        const response = await fetchUserSuki();
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data).toEqual({ data: "USK-03" });
    });
});
