import { WebSocketService } from "@/api";

export const useWebSocket = (): void => {
    const webSocketService = WebSocketService();

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    webSocketService.onopen;
};
