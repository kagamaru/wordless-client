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
            NEXT_PUBLIC_API_MOCKING: "disabled",
            NEXT_PUBLIC_AWS_REGION: "us-west-2",
            NEXT_PUBLIC_COGNITO_CLIENT_ID: "cognito-user-id",
            NEXT_PUBLIC_AUTHORITY: "public-authority",
            NEXT_PUBLIC_REDIRECT_URI: "http://localhost:3000",
            NEXT_PUBLIC_S3_URL: "https://s3.example-bucket.amazonaws.com"
        }
    }
});
