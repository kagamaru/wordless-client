// @vitest-environment node
import { CognitoIdentityProviderClient, DeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/deleteUser/route";

type PostRequestParams = {
    accessToken: string | null;
};

const deleteUserApiUrl = "https://api.mock.test/v1/cognito/deleteUser";

const mockJwtDecode = vi.fn(() => {
    return {
        sub: "mock-sub"
    };
});
vi.mock("jwt-decode", () => ({
    jwtDecode: () => mockJwtDecode()
}));

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: PostRequestParams) =>
    new NextRequest(deleteUserApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify({
            accessToken: body.accessToken
        })
    });

const testSetup = () => {
    mockCognitoProviderClient.on(DeleteUserCommand).resolves({});
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    mockJwtDecode.mockReturnValue({
        sub: "mock-sub"
    });
    testSetup();
});

const postDeleteUser = async (body: PostRequestParams): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("ユーザー削除API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postDeleteUser({
                accessToken: "test-token"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにアクセストークンがないとき、400エラーを返す", async (accessToken) => {
            const response = await postDeleteUser({
                accessToken: accessToken
            });

            expect(response.status).toBe(400);
        });

        test.each(["mock-sub-1", "mock-sub-2"])("サンプルユーザーのとき、400エラーを返す", async (userSub) => {
            mockJwtDecode.mockReturnValue({
                sub: userSub
            });

            const response = await postDeleteUser({
                accessToken: "test-token"
            });

            expect(response.status).toBe(400);
        });
    });
});
