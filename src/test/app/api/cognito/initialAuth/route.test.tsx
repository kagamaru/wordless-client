// @vitest-environment node
import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    NewDeviceMetadataType
} from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/initialAuth/route";

const initialAuthApiUrl = "https://api.mock.test/v1/cognito/initialAuth";

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: { session: string | null; email: string | null; password: string | null }) =>
    new NextRequest(initialAuthApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify(body)
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
        },
        AvailableChallenges: ["PASSWORD"],
        ChallengeName: "PASSWORD",
        ChallengeParameters: {
            USERNAME: "test@example.com"
        },
        Session: "string"
    });
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    testSetup();
});

const postConfirmSignup = async (body: {
    session: string | null;
    email: string | null;
    password: string | null;
}): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("ユーザー初期認証API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postConfirmSignup({
                session: "test-session",
                email: "test@example.com",
                password: "123456"
            });

            expect(response.status).toBe(200);
        });

        test("IdToken, AccessTokenを返す", async () => {
            const response = await postConfirmSignup({
                session: "test-session",
                email: "test@example.com",
                password: "123456"
            });
            const data = await response.json();

            expect(data.AuthenticationResult.IdToken).toBeDefined();
            expect(data.AuthenticationResult.AccessToken).toBeDefined();
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにセッションがないとき、400エラーを返す", async (session) => {
            const response = await postConfirmSignup({
                session,
                email: "test@example.com",
                password: "123456"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストにメールアドレスがないとき、400エラーを返す", async (email) => {
            const response = await postConfirmSignup({
                session: "test-session",
                email,
                password: "123456"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストにパスワードがないとき、400エラーを返す", async (password) => {
            const response = await postConfirmSignup({
                session: "test-session",
                email: "test@example.com",
                password
            });

            expect(response.status).toBe(400);
        });

        test.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
            "サンプルユーザーのとき、400エラーを返す",
            async (email) => {
                const response = await postConfirmSignup({
                    session: "test-session",
                    email,
                    password: "123456"
                });

                expect(response.status).toBe(400);
            }
        );
    });
});
