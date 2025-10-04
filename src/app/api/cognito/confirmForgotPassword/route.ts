import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";
import envConfigMap from "envConfig";

const cognitoClientId = envConfigMap.get("COGNITO_CLIENT_ID");
const sampleUserEmailNozomi = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS");
const sampleUserEmailNico = envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS");

export async function POST(req: NextRequest) {
    const client = getCognitoProviderClient();
    try {
        const { email, confirmationCode, newPassword } = await req.json();

        if (!email || !confirmationCode || !newPassword) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (email === sampleUserEmailNozomi || email === sampleUserEmailNico) {
            return NextResponse.json({ error: "Sample user cannot reset password" }, { status: 400 });
        }

        const command = new ConfirmForgotPasswordCommand({
            ClientId: cognitoClientId,
            Username: email,
            ConfirmationCode: confirmationCode,
            Password: newPassword
        });

        const response = await client.send(command);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        throw error;
    }
}
