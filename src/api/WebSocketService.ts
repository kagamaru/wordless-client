const WebSocketService = (): WebSocket => {
    const webSocket = new WebSocket(process.env.WEBSOCKET_URL ?? "");

    webSocket.onopen = () => {};

    webSocket.onclose = () => {};

    webSocket.onerror = () => {};

    return webSocket;
};

export { WebSocketService };
