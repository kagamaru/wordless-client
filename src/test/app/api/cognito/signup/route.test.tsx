// @vitest-environment node
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { POST } from "@/app/api/cognito/signup/route";

const signupApiUrl = "https://api.mock.test/v1/cognito/signup";

const mockCognitoProviderClient = mockClient(
    new CognitoIdentityProviderClient({
        region: process.env.REGION_AWS ?? ""
    })
);
vi.mock("@/app/api/cognito/getCognitoProviderClient", () => ({
    getCognitoProviderClient: () => mockCognitoProviderClient
}));

const getRequestParams = (body: { email: string | null; password: string | null }) =>
    new NextRequest(signupApiUrl, {
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
    mockCognitoProviderClient.on(SignUpCommand).resolves({});
};

beforeEach(() => {
    mockCognitoProviderClient.reset();
    testSetup();
});

const postSignup = async (body: { email: string | null; password: string | null }): Promise<NextResponse> => {
    return await POST(getRequestParams(body));
};

describe("ユーザー登録API", () => {
    describe("正常系", () => {
        test("status code 200を返す", async () => {
            const response = await postSignup({
                email: "test@example.com",
                password: "testpassword01"
            });

            expect(response.status).toBe(200);
        });
    });

    describe("異常系", () => {
        test.each(["", null])("リクエストにEメールがないとき、400エラーを返す", async (email) => {
            const response = await postSignup({
                email,
                password: "testpassword01"
            });

            expect(response.status).toBe(400);
        });

        test.each(["", null])("リクエストに新しいパスワードがないとき、400エラーを返す", async (newPassword) => {
            const response = await postSignup({
                email: "test@example.com",
                password: newPassword
            });

            expect(response.status).toBe(400);
        });

        test.each(["wordless.nozomi@example.com", "wordless.nico@example.com"])(
            "サンプルユーザーのとき、400エラーを返す",
            async (email) => {
                const response = await postSignup({
                    email,
                    password: "testpassword01"
                });

                expect(response.status).toBe(400);
            }
        );
    });
});
