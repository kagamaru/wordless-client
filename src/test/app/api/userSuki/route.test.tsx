// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { GET, POST } from "@/app/api/userSuki/[userId]/route";
import { PostUserSukiRequest } from "@/@types";

const userApiUrl = "https://api.mock.test/v1/userSuki/@test";

const server = setupServer(
    http.get(userApiUrl, () => {
        return HttpResponse.json({
            userId: "@test",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
        });
    }),
    http.post(userApiUrl, async () => {
        return HttpResponse.json({
            userId: "@test",
            userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
        });
    })
);

const token = "test-token";
const createGetRequestURL = new NextRequest(userApiUrl, {
    headers: {
        authorization: token
    }
});
const createPostRequestURL = (request: PostUserSukiRequest) =>
    new NextRequest(userApiUrl, {
        method: "POST",
        headers: {
            authorization: token
        },
        body: JSON.stringify(request)
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
    return await GET(createGetRequestURL, getRequestParams);
};

const postUserSuki = async (request: PostUserSukiRequest): Promise<NextResponse> => {
    return await POST(createPostRequestURL(request), getRequestParams);
};

describe("GET", () => {
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
});

describe("POST", () => {
    const postRequest: PostUserSukiRequest = {
        userSukiEmoji1: ":rat:",
        userSukiEmoji2: ":cow:",
        userSukiEmoji3: ":tiger:",
        userSukiEmoji4: ":rabbit:"
    };

    describe("正常系", () => {
        test("ユーザーの好きな絵文字に関する情報を返す", async () => {
            const response = await postUserSuki(postRequest);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                userId: "@test",
                userSuki: [":rat:", ":cow:", ":tiger:", ":rabbit:"]
            });
        });
    });

    describe("異常系", () => {
        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.post(userApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );

            const response = await postUserSuki(postRequest);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("パラメータが不正なとき、400を返す", async () => {
            server.use(
                http.post(userApiUrl, () => {
                    return HttpResponse.json({ error: "FOL-11" }, { status: 400 });
                })
            );

            const response = await postUserSuki(postRequest);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "FOL-11" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.post(userApiUrl, () => {
                    return HttpResponse.json({ error: "FOL-13" }, { status: 500 });
                })
            );

            const response = await postUserSuki(postRequest);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "FOL-13" });
        });
    });
});
