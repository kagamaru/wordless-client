import { NextRequest, NextResponse } from "next/server";
import { FetchEmotesResponse } from "@/class";
import { fetchWithTimeout, handleAPIError } from "@/helpers";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";
const defaultAcquisitions = "10";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const token = req.headers.get("authorization");

    try {
        const params = new URLSearchParams({
            userId: userId ?? "",
            numberOfCompletedAcquisitionsCompleted: defaultAcquisitions ?? ""
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
