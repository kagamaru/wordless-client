import { NextRequest, NextResponse } from "next/server";
import { deleteWithTimeout, fetchWithTimeout, getHeaders, handleAPIError, postWithTimeout } from "@/helpers";
import { PostUserNameRequest as PostUserRequest, User } from "@/@types";
import { BLACKLISTED } from "@/static/blackListIds";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ data: "USE-91" }, { status: 400 });
    }

    try {
        const response = await fetchWithTimeout<User>(restApiUrl + `user/${userId}`, getHeaders(token));

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");
    const body = (await req.json()) as PostUserRequest;

    if (!userId || !token || !body.userName) {
        return NextResponse.json({ data: "USE-91" }, { status: 400 });
    }

    try {
        const response = await postWithTimeout<{ userId: string }>(
            restApiUrl + `user/${userId}`,
            body,
            getHeaders(token)
        );

        if (!response.data) {
            throw new Error("No response data");
        }

        return NextResponse.json({ userId: response.data.userId }, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ data: "USE-91" }, { status: 400 });
    }

    if (BLACKLISTED.has(userId)) {
        return NextResponse.json({ data: "USE-92" }, { status: 400 });
    }

    try {
        const response = await deleteWithTimeout(restApiUrl + `user/${userId}`, undefined, getHeaders(token));

        return NextResponse.json({}, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
