import { NextRequest, NextResponse } from "next/server";
import { ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";

const client = getCognitoProviderClient();

export async function POST(req: NextRequest) {
    try {
        const { accessToken, previousPassword, proposedPassword } = await req.json();

        if (!accessToken || !previousPassword || !proposedPassword) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const command = new ChangePasswordCommand({
            AccessToken: accessToken,
            PreviousPassword: previousPassword,
            ProposedPassword: proposedPassword
        });

        const response = await client.send(command);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        throw error;
    }
}
