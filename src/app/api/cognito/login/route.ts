import { NextRequest, NextResponse } from "next/server";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";
import envConfigMap from "envConfig";

const cognitoClientId = envConfigMap.get("COGNITO_CLIENT_ID");

export async function POST(req: NextRequest) {
    const client = getCognitoProviderClient();
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
