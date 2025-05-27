import { useRouter } from "next/navigation";

export async function fetchWithTimeout<T>(url: string, options?: RestApiRequestOption, timeout = 5000): Promise<T> {
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

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("IdToken");
                throw new Error("Unauthorized");
            }
            throw new Error(JSON.stringify(await response.json()));
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function postWithTimeout<T>(
    url: string,
    data: Record<string, unknown>,
    options?: RestApiRequestOption,
    timeout = 5000
): Promise<T> {
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
            body: JSON.stringify(data)
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("IdToken");
                throw new Error("Unauthorized");
            }
            throw new Error(JSON.stringify(await response.json()));
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

type RestApiRequestOption = {
    headers?: Record<string, string>;
};
