// @vitest-environment node
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { NextRequest, NextResponse } from "next/server";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { POST } from "@/app/api/userImage/[userId]/route";

const userImagePostApiUrl = "https://api.mock.test/v1/userImage/@test/uploadUrl";
const userImagePutToS3Url = "https://signed-url.test/userProfile/%40a";

const server = setupServer(
    http.post(userImagePostApiUrl, () => {
        return HttpResponse.json({
            putUrl: "https://signed-url.test/userProfile/%40a",
            publicUrl: "https://access-url.test/userProfile/%40a"
        });
    }),
    http.put(userImagePutToS3Url, () => {
        return HttpResponse.json({});
    })
);

const createPostRequestURL = (fileData: FormData, token: string) =>
    new NextRequest(userImagePostApiUrl, {
        headers: {
            authorization: token
        },
        method: "POST",
        body: fileData
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

const postUserImage = async (args: { fileData: FormData; token: string; userId: string }): Promise<NextResponse> => {
    const { fileData, token, userId } = args;
    return await POST(createPostRequestURL(fileData, token), getRequestParams(userId));
};

describe("POST", () => {
    const validToken = "valid-token";
    const form = new FormData();
    form.append("file", new File([new Uint8Array([137, 80, 78, 71])], "avatar.png", { type: "image/png" }));

    describe("正常系", () => {
        test("200を返す", async () => {
            const response = await postUserImage({ fileData: form, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({});
        });
    });

    describe("異常系", () => {
        test("認証に失敗したとき、401を返す", async () => {
            server.use(
                http.post(userImagePostApiUrl, () => {
                    return HttpResponse.json({ error: "AUN-99" }, { status: 401 });
                })
            );

            const response = await postUserImage({ fileData: form, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ data: "AUN-99" });
        });

        test("userIdが空の時、IMG-91と400を返す", async () => {
            const response = await postUserImage({ fileData: form, token: validToken, userId: "" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "IMG-91" });
        });

        test("tokenが空の時、IMG-91と400を返す", async () => {
            const response = await postUserImage({ fileData: form, token: "", userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "IMG-91" });
        });

        test.each(["@wl_nozomi", "@wl_nico"])(
            "ブラックリストのユーザーIDが渡された時、IMG-92と400を返す",
            async (userIdInBlackList: string) => {
                const response = await postUserImage({ fileData: form, token: validToken, userId: userIdInBlackList });
                const data = await response.json();

                expect(response.status).toBe(400);
                expect(data).toEqual({ data: "IMG-92" });
            }
        );

        test("空のファイルが渡された時、IMG-93と400を返す", async () => {
            const emptyForm = new FormData();

            const response = await postUserImage({ fileData: emptyForm, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "IMG-93" });
        });

        test("署名付きURLを使った画像登録に失敗した時、IMG-94と502を返す", async () => {
            server.use(
                http.put(userImagePutToS3Url, () => {
                    return HttpResponse.json(
                        {},
                        {
                            status: 400
                        }
                    );
                })
            );

            const response = await postUserImage({ fileData: form, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(502);
            expect(data).toEqual({ data: "IMG-94" });
        });

        test("API側に渡ったパラメータが不正なとき、400を返す", async () => {
            server.use(
                http.post(userImagePostApiUrl, () => {
                    return HttpResponse.json({ error: "IMG-01" }, { status: 400 });
                })
            );

            const response = await postUserImage({ fileData: form, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data).toEqual({ data: "IMG-01" });
        });

        test("サーバーに接続できないとき、500を返す", async () => {
            server.use(
                http.post(userImagePostApiUrl, () => {
                    return HttpResponse.json({ error: "IMG-06" }, { status: 500 });
                })
            );

            const response = await postUserImage({ fileData: form, token: validToken, userId: "@test" });
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ data: "IMG-06" });
        });
    });
});
