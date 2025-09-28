// @vitest-environment node
import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/confirmForgotPassword/route";

const confirmForgotPasswordApiUrl = "https://api.mock.test/v1/cognito/confirmForgotPassword";

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: {
    email: string | null;
    confirmationCode: string | null;
    newPassword: string | null;
}) =>
    new NextRequest(confirmForgotPasswordApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify({
            email: body.email,
            confirmationCode: body.confirmationCode,
            newPassword: body.newPassword
        })
    });

const testSetup = () => {
    mockCognitoProviderClient.on(ConfirmForgotPasswordCommand).resolves({});
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    testSetup();
});

const postForgotPassword = async (body: {
    email: string | null;
    confirmationCode: string | null;
    newPassword: string | null;
}): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("パスワード変更確認API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postForgotPassword({
                email: "test@example.com",
                confirmationCode: "123456",
                newPassword: "testpassword01"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにEメールがないとき、400エラーを返す", async (email) => {
            const response = await postForgotPassword({
                email,
                confirmationCode: "123456",
                newPassword: "testpassword01"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストに確認コードがないとき、400エラーを返す", async (confirmationCode) => {
            const response = await postForgotPassword({
                email: "test@example.com",
                confirmationCode: confirmationCode,
                newPassword: "testpassword01"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストに新しいパスワードがないとき、400エラーを返す", async (newPassword) => {
            const response = await postForgotPassword({
                email: "test@example.com",
                confirmationCode: "123456",
                newPassword: newPassword
            });

            expect(response.status).toBe(400);
        });

        test.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
            "サンプルユーザーのとき、400エラーを返す",
            async (email) => {
                const response = await postForgotPassword({
                    email,
                    confirmationCode: "123456",
                    newPassword: "testpassword01"
                });

                expect(response.status).toBe(400);
            }
        );
    });
});
