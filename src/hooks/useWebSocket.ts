import { WebSocketService } from "@/api";
import { useError } from "@/hooks";
import { useState } from "react";

export const useWebSocket = () => {
    const [webSocketError, setWebSocketError] = useState<{
        errorCode: "WSK-99" | undefined;
        errorMessage: string;
    }>({
        errorCode: undefined,
        errorMessage: ""
    });
    const [hasWebSocketError, setHasWebSocketError] = useState(false);
    const { getErrorMessage } = useError();

    const webSocketService = WebSocketService();

    const webSocketOpen = () => {
        // NOTE: WebSocketAPIとの接続。解決が難しいのでeslintの制約を無視する
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        webSocketService.onopen;
    };

    webSocketService.onerror = () => {
        setHasWebSocketError(true);
        setWebSocketError({
            errorCode: "WSK-99",
            errorMessage: getErrorMessage("WSK-99")
        });
    };

    return {
        hasWebSocketError,
        webSocketError,
        webSocketOpen
    };
};
