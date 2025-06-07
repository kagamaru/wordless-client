import { NextRequest, NextResponse } from "next/server";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION ?? ""
});
const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: cognitoClientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });

        const response = await client.send(command);
        const result = response.AuthenticationResult;

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        throw error;
    }
}
