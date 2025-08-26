import { NextRequest, NextResponse } from "next/server";
import { deleteWithTimeout, handleAPIError } from "@/helpers";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ emoteId: string }> }
): Promise<NextResponse> {
    const { emoteId } = await params;
    const body = (await req.json()) as { userId: string };
    const token = req.headers.get("authorization");

    try {
        const response = await deleteWithTimeout(restApiUrl + `emote/${emoteId}`, body, {
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
