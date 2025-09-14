// @vitest-environment node
import { ChangePasswordCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/changePassword/route";

type PostRequestParams = {
    accessToken: string | null;
    previousPassword: string | null;
    proposedPassword: string | null;
};

const changePasswordApiUrl = "https://api.mock.test/v1/cognito/changePassword";

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
    new NextRequest(changePasswordApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify({
            accessToken: body.accessToken,
            previousPassword: body.previousPassword,
            proposedPassword: body.proposedPassword
        })
    });

const testSetup = () => {
    mockCognitoProviderClient.on(ChangePasswordCommand).resolves({});
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    mockJwtDecode.mockReturnValue({
        sub: "mock-sub"
    });
    testSetup();
});

const postChangePassword = async (body: PostRequestParams): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("パスワード変更API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postChangePassword({
                accessToken: "test-token",
                previousPassword: "test-password-old",
                proposedPassword: "test-password-new"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにアクセストークンがないとき、400エラーを返す", async (accessToken) => {
            const response = await postChangePassword({
                accessToken: accessToken,
                previousPassword: "test-password-old",
                proposedPassword: "test-password-new"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストに現在のパスワードがないとき、400エラーを返す", async (previousPassword) => {
            const response = await postChangePassword({
                accessToken: "test-token",
                previousPassword: "",
                proposedPassword: "test-password-new"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストに新しいパスワードがないとき、400エラーを返す", async (proposedPassword) => {
            const response = await postChangePassword({
                accessToken: "test-token",
                previousPassword: "test-password-old",
                proposedPassword: ""
            });

            expect(response.status).toBe(400);
        });

        test.each(["mock-sub-1", "mock-sub-2"])("サンプルユーザーのとき、400エラーを返す", async (userSub) => {
            mockJwtDecode.mockReturnValue({
                sub: userSub
            });

            const response = await postChangePassword({
                accessToken: "test-token",
                previousPassword: "test-password-old",
                proposedPassword: "test-password-new"
            });

            expect(response.status).toBe(400);
        });
    });
});
