import { NextRequest, NextResponse } from "next/server";
import { deleteWithTimeout, fetchWithTimeout, handleAPIError, postWithTimeout } from "@/helpers";
import { PostUserNameRequest as PostUserRequest, User } from "@/@types";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ data: "USE-91" }, { status: 400 });
    }

    try {
        const response = await fetchWithTimeout<User>(restApiUrl + `users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

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
        const response = await postWithTimeout<{ userId: string }>(restApiUrl + `users/${userId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

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

    try {
        const response = await deleteWithTimeout(restApiUrl + `users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return NextResponse.json({}, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
