import { NextRequest, NextResponse } from "next/server";
import { User } from "@/@types";
import { fetchWithTimeout, getHeaders, handleAPIError } from "@/helpers";
import envConfigMap from "envConfig";

const restApiUrl = envConfigMap.get("REST_API_URL");

export async function GET(req: NextRequest, { params }: { params: Promise<{ userSub: string }> }) {
    const { userSub } = await params;
    const token = req.headers.get("authorization");

    if (!userSub || !token) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await fetchWithTimeout<User>(restApiUrl + `userSub/${userSub}`, getHeaders(token));

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
