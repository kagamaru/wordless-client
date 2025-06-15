import { APIResponse } from "@/@types";

export async function fetchNextjsServer<T>(url: string, init?: RequestInit): Promise<APIResponse<T>> {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {})
        },
        ...init
    });

    const contentType = response.headers.get("Content-Type") ?? "";

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(JSON.stringify({ status: response.status, data: (await response.json()).data }));
        }

        let errorBody = {};
        try {
            errorBody = contentType.includes("application/json") ? (await response.json()).data : await response.text();
        } catch {
            errorBody = { message: "No response body" };
        }

        throw new Error(
            JSON.stringify({
                status: response.status,
                data: errorBody
            })
        );
    }

    return {
        data: await response.json(),
        status: response.status
    };
}
