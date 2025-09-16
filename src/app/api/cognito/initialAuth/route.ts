import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextRequest, NextResponse } from "next/server";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";

const cognitoClientId = process.env.COGNITO_CLIENT_ID as string;
const sampleUserEmailNozomi = process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS as string;
const sampleUserEmailNico = process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS as string;

export async function POST(req: NextRequest) {
    const client = getCognitoProviderClient();
    try {
        const { session, email, password } = await req.json();

        if (!session || !email || !password) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        if (email === sampleUserEmailNozomi || email === sampleUserEmailNico) {
            return NextResponse.json({ error: "Sample user cannot reset password" }, { status: 400 });
        }

        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: cognitoClientId,
            Session: session,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });

        const response = await client.send(command);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        throw error;
    }
}
