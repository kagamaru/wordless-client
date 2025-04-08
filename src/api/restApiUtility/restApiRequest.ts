export async function restApiRequest<T>(
    url: string,
    method: "GET" | "POST",
    data?: Object,
    options?: RestApiRequestOption
): Promise<T> {
    try {
        const response =
            method === "GET" ? await fetchWithTimeout(url, options) : await postWithTimeout(url, data, options);
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
        if (!response.ok) {
            throw new Error(JSON.stringify(await response.json()));
        }
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function postWithTimeout(
    url: string,
    data: unknown,
    options?: RestApiRequestOption,
    timeout = 5000
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {})
            },
            body: JSON.stringify(data),
            ...options
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(JSON.stringify(await response.json()));
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

type RestApiRequestOption = {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
};
