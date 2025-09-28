import {
    APIResponse,
    ErrorCode,
    OnPostEmoteIncomingMessage,
    OnReactIncomingMessage,
    PostEmoteRequest,
    ReactRequest
} from "@/@types";
import { useEmoteStore } from "@/store";

export class WebSocketService {
    private socket: WebSocket;

    constructor(url: string, onErrorCallback: (error: APIResponse<ErrorCode>) => void) {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.log("WebSocket connected");
        };

        this.socket.onclose = (event) => {
            console.log("WebSocket disconnected");
            if (!event.wasClean) {
                onErrorCallback({
                    data: "WSK-99",
                    status: 500
                });
            }
        };

        this.socket.onmessage = (event: MessageEvent) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            const actionName: "onReact" | "onPostEmote" = data.action;

            if (actionName === "onReact") {
                const onReactIncomingMessageData = data as OnReactIncomingMessage;
                useEmoteStore.getState().updateEmoteReactionEmojis(onReactIncomingMessageData);
            } else if (actionName === "onPostEmote") {
                const onPostEmoteIncomingMessageData = data as OnPostEmoteIncomingMessage;
                useEmoteStore.getState().addEmote(onPostEmoteIncomingMessageData.emote);
            }
        };

        this.socket.onerror = () => {
            console.error("WebSocket error");
            onErrorCallback({
                data: "WSK-99",
                status: 500
            });
        };
    }

    public onReact(request: ReactRequest): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "onReact", ...request }));
        } else {
            console.warn("WebSocket is not open. Message not sent.");
        }
    }

    public onPostEmote(request: PostEmoteRequest): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: "onPostEmote", ...request }));
        } else {
            console.warn("WebSocket is not open. Message not sent.");
        }
    }
}
