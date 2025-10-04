import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";
import envConfigMap from "envConfig";

const cognitoClientId = envConfigMap.get("COGNITO_CLIENT_ID");
const sampleUserEmailNozomi = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS");
const sampleUserEmailNico = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS");

export async function POST(req: NextRequest) {
    const client = getCognitoProviderClient();
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (email === sampleUserEmailNozomi || email === sampleUserEmailNico) {
            return NextResponse.json({ error: "Sample user cannot reset password" }, { status: 400 });
        }

        const command = new SignUpCommand({
            ClientId: cognitoClientId,
            Username: email,
            Password: password
        });

        const response = await client.send(command);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        throw error;
    }
}
