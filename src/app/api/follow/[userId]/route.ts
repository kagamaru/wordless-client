import { NextRequest, NextResponse } from "next/server";
import { FetchFollowResponse, PostFollowRequest } from "@/@types";
import { deleteWithTimeout, fetchWithTimeout, getHeaders, handleAPIError, postWithTimeout } from "@/helpers";
import envConfigMap from "envConfig";

const restApiUrl = envConfigMap.get("REST_API_URL");

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await fetchWithTimeout<FetchFollowResponse>(
            restApiUrl + `follow/${userId}`,
            getHeaders(token)
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");
    const body = (await req.json()) as PostFollowRequest;

    if (!userId || !token || !body.followerId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await postWithTimeout<FetchFollowResponse>(
            restApiUrl + `follow/${userId}`,
            body,
            getHeaders(token)
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");
    const body = (await req.json()) as PostFollowRequest;

    if (!userId || !token || !body.followerId) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const response = await deleteWithTimeout<FetchFollowResponse>(
            restApiUrl + `follow/${userId}`,
            body,
            getHeaders(token)
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
