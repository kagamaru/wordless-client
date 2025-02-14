const WebSocketService = (): WebSocket => {
    const webSocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "");

    webSocket.onopen = (): void => {
        console.log("WebSocket connected");
    };

    webSocket.onclose = () => {
        console.log("WebSocket disconnected");
    };

    webSocket.onerror = (error) => {
        console.log(error);
    };

    return webSocket;
};

export { WebSocketService };
