// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { DELETE, GET, POST } from "@/app/api/user/[userId]/route";

const userApiUrl = "https://api.mock.test/v1/users/@test";

const server = setupServer(
    http.get(userApiUrl, () => {
        return HttpResponse.json({
            userId: "@test",
            userName: "TEST",
            userAvatarUrl: "https://image.test/d.png"
        });
    }),
    http.post(userApiUrl, () => {
        return HttpResponse.json({
            userId: "@test"
        });
    }),
    http.delete(userApiUrl, () => {
        return HttpResponse.json({}, { status: 200 });
    })
);

const token = "test-token";
const getRequestURL = new NextRequest(userApiUrl, {
    headers: {
        authorization: token
    }
});
const getPostRequestURL = (userName?: string) =>
    new NextRequest(userApiUrl, {
        method: "POST",
        headers: {
            authorization: token
        },
        body: JSON.stringify({
            userName
        })
    });

const createRequestParams = (userId?: string) => ({
    params: new Promise<{ userId: string }>((resolve) => {
        resolve({
            userId: userId as string
        });
    })
});

beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

const fetchUser = async (userId?: string): Promise<NextResponse> => {
    return await GET(getRequestURL, createRequestParams(userId));
};

const postUser = async (userId?: string, userName?: string): Promise<NextResponse> => {
    return await POST(getPostRequestURL(userName), createRequestParams(userId));
};

const deleteUser = async (userId?: string): Promise<NextResponse> => {
    return await DELETE(getRequestURL, createRequestParams(userId));
};

describe("GET", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await fetchUser("@test");

            expect(response.status).toBe(200);
        });

        test("ユーザー情報を返す", async () => {
            const response = await fetchUser("@test");
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

            const response = await fetchUser("@test");
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test.each(["", undefined])("userIdが空の時、400を返す", async (userId) => {
            const response = await deleteUser(userId);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test("パラメータが不正なとき、400を返す", async () => {
            server.use(
                http.get(userApiUrl, () => {
                    return HttpResponse.json({ error: "USE-01" }, { status: 400 });
                })
            );

            const response = await fetchUser("@test");
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-01" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.get(userApiUrl, () => {
                    return HttpResponse.json({ error: "USE-03" }, { status: 500 });
                })
            );

            const response = await fetchUser("@test");
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "USE-03" });
        });
    });
});

describe("POST", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postUser("@test", "TEST");

            expect(response.status).toBe(200);
        });

        test("ユーザーIDを返す", async () => {
            const response = await postUser("@test", "TEST");
            const data = await response.json();

            expect(data).toEqual({
                userId: "@test"
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

            const response = await postUser("@test", "TEST");
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test.each(["", undefined])("userIdが空の時、400を返す", async (userId) => {
            const response = await postUser(userId, "TEST");
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test.each(["", undefined])("userNameが空の時、400を返す", async (userName) => {
            const response = await postUser("@test", userName);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.post(userApiUrl, () => {
                    return HttpResponse.json({ error: "USE-35" }, { status: 500 });
                })
            );

            const response = await postUser("@test", "TEST");
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "USE-35" });
        });
    });
});

describe("DELETE", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await deleteUser("@test");

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.delete(userApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );

            const response = await deleteUser("@test");
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test.each(["", undefined])("userIdが空の時、400を返す", async (userId) => {
            const response = await deleteUser(userId);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.delete(userApiUrl, () => {
                    return HttpResponse.json({ error: "USE-44" }, { status: 500 });
                })
            );

            const response = await deleteUser("@test");
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "USE-44" });
        });
    });
});
