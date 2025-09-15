// @vitest-environment node
import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    NewDeviceMetadataType
} from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/login/route";

const loginApiUrl = "https://api.mock.test/v1/cognito/login";

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: { email: string | null; password: string | null }) =>
    new NextRequest(loginApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify({
            email: body.email,
            password: body.password
        })
    });

const testSetup = () => {
    mockCognitoProviderClient.on(InitiateAuthCommand).resolves({
        AuthenticationResult: {
            AccessToken: "mock-access-token",
            IdToken: "mock-id-token",
            RefreshToken: "mock-refresh-token",
            ExpiresIn: 3600,
            TokenType: "Bearer",
            NewDeviceMetadata: {
                DeviceKey: "mock-device-key",
                DeviceGroupKey: "mock-device-group-key"
            } as NewDeviceMetadataType
        }
    });
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    testSetup();
});

const postLogin = async (body: { email: string | null; password: string | null }): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("ログインAPI", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postLogin({
                email: "test@example.com",
                password: "testpassword01"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにEメールがないとき、400エラーを返す", async (email) => {
            const response = await postLogin({
                email,
                password: "testpassword01"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストにパスワードがないとき、400エラーを返す", async (password) => {
            const response = await postLogin({
                email: "test@example.com",
                password: password
            });

            expect(response.status).toBe(400);
        });
    });
});
