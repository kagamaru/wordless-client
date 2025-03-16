import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        env: {
            NEXT_PUBLIC_WEBSOCKET_URL: "wss://localhost.com/dev/",
            NEXT_PUBLIC_REST_API_URL: "https://localhost.com/dev/",
            NEXT_PUBLIC_API_MOCKING: "disabled"
        }
    }
});
