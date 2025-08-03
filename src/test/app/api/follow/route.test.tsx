import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { GET, POST } from "@/app/api/follow/[userId]/route";

const userApiUrl = "https://api.mock.test/v1/follow/@test";

const server = setupServer(
    http.get(userApiUrl, () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@hoge", "@fuga", "@piyo"],
            totalNumberOfFollowees: 10,
            followeeUserIds: ["@hoge", "@fuga", "@piyo"]
        });
    }),
    http.post(userApiUrl, () => {
        return HttpResponse.json({
            totalNumberOfFollowing: 10,
            followingUserIds: ["@hoge", "@fuga", "@piyo"],
            totalNumberOfFollowees: 11,
            followeeUserIds: ["@hoge", "@fuga", "@piyo", "@test"]
        });
    })
);

const token = "test-token";
const getGetRequestURL = new NextRequest(userApiUrl, {
    headers: {
        authorization: token
    }
});

const getPostRequestURL = (followerId: string) =>
    new NextRequest(userApiUrl, {
        headers: {
            authorization: token
        },
        method: "POST",
        body: JSON.stringify({
            followerId
        })
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

const fetchFollow = async (): Promise<NextResponse> => {
    return await GET(getGetRequestURL, getRequestParams);
};

const postFollow = async (followerId: string): Promise<NextResponse> => {
    return await POST(getPostRequestURL(followerId), getRequestParams);
};

describe("GET", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await fetchFollow();

            expect(response.status).toBe(200);
        });

        test("フォロー/フォロワーに関する情報を返す", async () => {
            const response = await fetchFollow();
            const data = await response.json();

            expect(data).toEqual({
                totalNumberOfFollowing: 10,
                followingUserIds: ["@hoge", "@fuga", "@piyo"],
                totalNumberOfFollowees: 10,
                followeeUserIds: ["@hoge", "@fuga", "@piyo"]
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

            const response = await fetchFollow();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("パラメータが不正なとき、400を返す", async () => {
            server.use(
                http.get(userApiUrl, () => {
                    return HttpResponse.json({ error: "FOL-01" }, { status: 400 });
                })
            );

            const response = await fetchFollow();
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "FOL-01" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.get(userApiUrl, () => {
                    return HttpResponse.json({ error: "FOL-03" }, { status: 500 });
                })
            );

            const response = await fetchFollow();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "FOL-03" });
        });
    });
});

describe("POST", () => {
    describe("正常系", () => {
        test("フォロー/フォロワーに関する情報を返す", async () => {
            const response = await postFollow("@test");
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                totalNumberOfFollowing: 10,
                followingUserIds: ["@hoge", "@fuga", "@piyo"],
                totalNumberOfFollowees: 11,
                followeeUserIds: ["@hoge", "@fuga", "@piyo", "@test"]
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

            const response = await postFollow("@test");
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

            const response = await postFollow("@test");
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

            const response = await postFollow("@test");
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "FOL-13" });
        });
    });
});
