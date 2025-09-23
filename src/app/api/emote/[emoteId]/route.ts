import { NextRequest, NextResponse } from "next/server";
import { deleteWithTimeout, getHeaders, handleAPIError } from "@/helpers";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ emoteId: string }> }
): Promise<NextResponse> {
    const { emoteId } = await params;
    const body = (await req.json()) as { userId: string };
    const token = req.headers.get("authorization");

    if (!token) {
        return NextResponse.json({ data: "AUN-99" }, { status: 401 });
    }

    try {
        const response = await deleteWithTimeout(restApiUrl + `emote/${emoteId}`, body, getHeaders(token));

        return NextResponse.json({}, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
