// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { POST } from "@/app/api/userName/[userId]/route";
import { PostUserNameRequest } from "@/@types";

const userNamePostApiUrl = "https://api.mock.test/v1/users/@test/name";

const server = setupServer(
    http.post(userNamePostApiUrl, () => {
        return HttpResponse.json({});
    })
);

const createPostRequestURL = (body: PostUserNameRequest, token: string) =>
    new NextRequest(userNamePostApiUrl, {
        headers: {
            authorization: token
        },
        method: "POST",
        body: JSON.stringify(body)
    });

const getRequestParams = (userId: string) => ({
    params: new Promise<{ userId: string }>((resolve) => {
        resolve({
            userId
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

const postUserName = async (args: {
    body: PostUserNameRequest;
    token: string;
    userId: string;
}): Promise<NextResponse> => {
    const { body, token, userId } = args;
    return await POST(createPostRequestURL(body, token), getRequestParams(userId));
};

const validToken = "valid-token";

describe("POST", () => {
    describe("正常系", () => {
        test("200を返す", async () => {
            const response = await postUserName({ body: { userName: "test" }, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({});
        });
    });

    describe("異常系", () => {
        test("userIdが空の時、USE-91と400を返す", async () => {
            const response = await postUserName({ body: { userName: "test" }, token: validToken, userId: "" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test("tokenが空の時、USE-91と400を返す", async () => {
            const response = await postUserName({ body: { userName: "test" }, token: "", userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "USE-91" });
        });

        test.each(["@wl_nozomi", "@wl_nico"])(
            "ブラックリストのユーザーIDが渡された時、USE-92と400を返す",
            async (userIdInBlackList: string) => {
                const response = await postUserName({
                    body: { userName: "test" },
                    token: validToken,
                    userId: userIdInBlackList
                });
                const data = await response.json();

                expect(response.status).toBe(400);
                expect(data).toEqual({ data: "USE-92" });
            }
        );

        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.post(userNamePostApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );

            const response = await postUserName({ body: { userName: "test" }, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.post(userNamePostApiUrl, () => {
                    return HttpResponse.json({ error: "USE-27" }, { status: 500 });
                })
            );

            const response = await postUserName({ body: { userName: "test" }, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "USE-27" });
        });
    });
});
