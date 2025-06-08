import { NextRequest, NextResponse } from "next/server";
import { FetchEmotesResponse } from "@/class";
import { fetchWithTimeout, handleAPIError } from "@/helpers";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const numberOfCompletedAcquisitionsCompleted = searchParams.get("numberOfCompletedAcquisitionsCompleted");
    const token = req.headers.get("authorization");

    try {
        const params = new URLSearchParams({
            userId: userId ?? "",
            numberOfCompletedAcquisitionsCompleted: numberOfCompletedAcquisitionsCompleted ?? ""
        });

        const response = await fetchWithTimeout<FetchEmotesResponse>(restApiUrl + `emotes/?${params}`, {
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
