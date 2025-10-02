import { ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
import { getCognitoProviderClient } from "@/app/api/cognito/getCognitoProviderClient";
import envConfigMap from "envConfig";

export async function POST(req: NextRequest) {
    const client = getCognitoProviderClient();
    try {
        const { accessToken, previousPassword, proposedPassword } = await req.json();

        if (!accessToken || !previousPassword || !proposedPassword) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const { sub } = jwtDecode<{ sub: string }>(accessToken);

        if (
            sub === envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_SUB") ||
            sub === envConfigMap.get("NEXT_PUBLIC_SAMPLE_USER_NICO_USER_SUB")
        ) {
            return NextResponse.json({ error: "Sample user cannot change password" }, { status: 400 });
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
