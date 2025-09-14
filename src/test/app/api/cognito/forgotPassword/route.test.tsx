// @vitest-environment node
import { CognitoIdentityProviderClient, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/forgotPassword/route";

const forgotPasswordApiUrl = "https://api.mock.test/v1/cognito/forgotPassword";

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: { email: string | null }) =>
    new NextRequest(forgotPasswordApiUrl, {
        method: "POST",
        headers: {
            authorization: "test-token"
        },
        body: JSON.stringify({
            email: body.email
        })
    });

const testSetup = () => {
    mockCognitoProviderClient.on(ForgotPasswordCommand).resolves({
        CodeDeliveryDetails: {
            AttributeName: "email",
            DeliveryMedium: "EMAIL",
            Destination: "test@example.com"
        }
    });
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    testSetup();
});

const postForgotPassword = async (body: { email: string | null }): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("パスワード変更API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postForgotPassword({
                email: "test@example.com"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにEメールがないとき、400エラーを返す", async (email) => {
            const response = await postForgotPassword({
                email
            });

            expect(response.status).toBe(400);
        });

        test.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
            "サンプルユーザーのとき、400エラーを返す",
            async (email) => {
                const response = await postForgotPassword({
                    email
                });

                expect(response.status).toBe(400);
            }
        );
    });
});
