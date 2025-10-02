import { useEffect, useState } from "react";
import { initMocks } from "@/mocks";
import envConfigMap from "envConfig";

export const useMock = (): boolean => {
    const [isMockReady, setIsMockReady] = useState(false);

    useEffect(() => {
        (async () => {
            if (envConfigMap.get("NEXT_PUBLIC_API_MOCKING") === "enabled") {
                await initMocks().then(() => {
                    setIsMockReady(true);
                });
            }
        })();
    }, []);

    return isMockReady;
};
