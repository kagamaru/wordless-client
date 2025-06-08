import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        env: {
            NEXT_PUBLIC_WEBSOCKET_URL: "wss://localhost.com/dev/",
            NEXT_PUBLIC_S3_URL: "https://s3.example-bucket.amazonaws.com",
            NEXT_PUBLIC_API_MOCKING: "disabled",
            REST_API_URL: "https://localhost.com/dev/",
            REGION_AWS: "us-west-2",
            COGNITO_CLIENT_ID: "cognito-user-id"
        }
    }
});
