import { APIResponse, RestApiRequestOption } from "@/@types";

export async function fetchWithTimeout<T>(
    url: string,
    options?: RestApiRequestOption,
    timeout = 5000
): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {})
            }
        });
        clearTimeout(timeoutId);
        const contentType = response.headers.get("Content-Type") ?? "";

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(JSON.stringify({ status: response.status, data: "AUN-99" }));
            }
            throw new Error(
                JSON.stringify({
                    status: response.status,
                    data: contentType.includes("application/json")
                        ? (await response.json()).error
                        : await response.text()
                })
            );
        }

        return {
            data: await response.json(),
            status: response.status
        };
    } catch (error) {
        throw error;
    }
}
