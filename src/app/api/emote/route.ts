import { NextRequest, NextResponse } from "next/server";
import { FetchEmotesResponse } from "@/class";
import { fetchWithTimeout, getHeaders, handleAPIError } from "@/helpers";

const restApiUrl = process.env.REST_API_URL ?? "";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const numberOfCompletedAcquisitionsCompleted = searchParams.get("numberOfCompletedAcquisitionsCompleted");
    const sequenceNumberStartOfSearch = searchParams.get("sequenceNumberStartOfSearch");
    const token = req.headers.get("authorization");

    if (!token) {
        return NextResponse.json({ data: "AUN-99" }, { status: 401 });
    }

    try {
        const params = new URLSearchParams({
            userId: userId ?? "",
            numberOfCompletedAcquisitionsCompleted: numberOfCompletedAcquisitionsCompleted ?? "",
            sequenceNumberStartOfSearch: sequenceNumberStartOfSearch ?? ""
        });

        const response = await fetchWithTimeout<FetchEmotesResponse>(
            restApiUrl + `emotes/?${params}`,
            getHeaders(token)
        );

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return handleAPIError(error);
    }
}
