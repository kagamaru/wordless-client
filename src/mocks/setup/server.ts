import { setupServer } from "msw/node";
import { restHandlers } from "@/mocks/handlers/rest";
import { websocketHandlers } from "@/mocks/handlers/ws/websocket";

export const server = setupServer(...restHandlers, ...websocketHandlers);
