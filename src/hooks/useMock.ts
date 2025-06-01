import { initMocks } from "@/mocks";
import { useEffect, useState } from "react";

export const useMock = (): boolean => {
    const [isMockReady, setIsMockReady] = useState(false);

    useEffect(() => {
        (async () => {
            if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
                await initMocks().then(() => {
                    setIsMockReady(true);
                });
            }
        })();
    }, []);

    return isMockReady;
};
