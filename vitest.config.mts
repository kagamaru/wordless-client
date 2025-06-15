import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        env: {
            NEXT_PUBLIC_WEBSOCKET_URL: "wss://mock.test/ws/",
            NEXT_PUBLIC_S3_URL: "https://mock-bucket.test/assets/",
            NEXT_PUBLIC_API_MOCKING: "disabled",
            REST_API_URL: "https://api.mock.test/v1/",
            REGION_AWS: "mock-region-1",
            COGNITO_CLIENT_ID: "mock-client-id-XXXX"
        }
    }
});
