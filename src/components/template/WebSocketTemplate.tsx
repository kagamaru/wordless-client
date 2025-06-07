"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { useError } from "@/hooks";
import { WebSocketService } from "@/app/api/_WebSocketService";

export const WebSocketContext = createContext<WebSocketService | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const refWebSocketService = useRef<WebSocketService | null>(null);
    const { handleErrors } = useError();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL + "?Authorization=" + localStorage.getItem("IdToken");
        refWebSocketService.current = new WebSocketService(url, handleErrors);
        setIsReady(true);
    }, []);

    if (!isReady || !refWebSocketService.current) return null;

    return <WebSocketContext.Provider value={refWebSocketService.current}>{children}</WebSocketContext.Provider>;
}
