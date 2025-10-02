import envConfigMap from "envConfig";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs" && envConfigMap.get("NEXT_PUBLIC_API_MOCKING") === "enabled") {
        const { initMocks } = await import("@/mocks");
        initMocks();
    }
}
