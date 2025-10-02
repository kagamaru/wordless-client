import { NextRequest, NextResponse } from "next/server";
import { PostUserSukiRequest, PostUserSukiResponse, User } from "@/@types";
import { fetchWithTimeout, getHeaders, handleAPIError, postWithTimeout } from "@/helpers";
import envConfigMap from "envConfig";

const restApiUrl = envConfigMap.get("REST_API_URL");

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await fetchWithTimeout<User>(restApiUrl + `userSuki/${userId}`, getHeaders(token));

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");
    const body = (await req.json()) as PostUserSukiRequest;

    if (!userId || !token) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await postWithTimeout<PostUserSukiResponse>(
            restApiUrl + `userSuki/${userId}`,
            body,
            getHeaders(token)
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
