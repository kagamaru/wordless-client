import { NextRequest, NextResponse } from "next/server";
import { PostUserNameRequest } from "@/@types";
import { handleAPIError, postWithTimeout } from "@/helpers";
import { BLACKLISTED } from "@/static/blackListIds";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");
    const body = (await req.json()) as PostUserNameRequest;

    if (!userId || !token) {
        return NextResponse.json({ data: "USE-91" }, { status: 400 });
    }
    if (BLACKLISTED.has(userId)) {
        return NextResponse.json({ data: "USE-92" }, { status: 400 });
    }

    try {
        const response = await postWithTimeout(restApiUrl + `users/${userId}/name`, body, {
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
