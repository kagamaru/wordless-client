import { setupWorker } from "msw/browser";
import { restHandlers } from "@/mocks/handlers/rest";
import { websocketHandlers } from "@/mocks/handlers/ws/websocket";

export const worker = setupWorker(...restHandlers, ...websocketHandlers);
