export async function restApiRequest<T>(url: string, options?: RestApiRequestOption): Promise<T> {
    try {
        const response = await fetchWithTimeout(url, options);
        return response as T;
    } catch (error) {
        throw error;
    }
}

async function fetchWithTimeout(url: string, options?: RestApiRequestOption, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal, ...options });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            console.error("Request timed out");
        } else if (error instanceof Error) {
            console.error("Fetch error:", error.message);
        } else {
            console.error("Unknown error occurred");
        }
        throw error;
    }
}

type RestApiRequestOption = {
    method: string;
    headers: Record<string, string>;
    body: string;
};
