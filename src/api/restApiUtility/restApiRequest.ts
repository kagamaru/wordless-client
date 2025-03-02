export async function restApiRequest<T>(url: string, options?: RestApiRequestOption): Promise<T> {
    try {
        const response = await fetchWithTimeout(url, options);
        return response as T;
    } catch (error) {
        throw error;
    }
}

async function fetchWithTimeout(url: string, options?: RestApiRequestOption, timeout = 5000): Promise<Response | void> {
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

type RestApiRequestOption = {
    method: string;
    headers: Record<string, string>;
    body: string;
};
