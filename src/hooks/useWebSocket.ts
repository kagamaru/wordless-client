import { WebSocketService } from "@/api";

export const useWebSocket = (): void => {
    const webSocketService = WebSocketService();

    // NOTE: WebSocketAPIとの接続。解決が難しいのでeslintの制約を無視する
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    webSocketService.onopen;
};
