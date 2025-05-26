import { ReactRequest } from "@/@types";

export class WebSocketService {
    private socket: WebSocket;

    constructor(url: string, onErrorCallback: (error: Error) => void) {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log("WebSocket connected");
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket disconnected");
            if (!event.wasClean) {
                onErrorCallback(
                    new Error(
                        JSON.stringify({
                            errorCode: "WSK-99"
                        })
                    )
                );
            }
        };

        this.socket.onerror = () => {
            console.error("WebSocket error");
            onErrorCallback(
                new Error(
                    JSON.stringify({
                        errorCode: "WSK-99"
                    })
                )
            );
        };
    }

    public onReact(request: ReactRequest): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "onReact", ...request }));
        } else {
            console.warn("WebSocket is not open. Message not sent.");
        }
    }
}
