import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, handleAPIError } from "@/helpers";

import { User } from "@/@types";

const restApiUrl = process.env.NEXT_PUBLIC_REST_API_URL ?? "";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const token = req.headers.get("authorization");

    if (!userId || !token) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
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
