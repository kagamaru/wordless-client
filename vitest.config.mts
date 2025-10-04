import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        env: {
            NEXT_PUBLIC_WEBSOCKET_URL: "wss://mock.test/ws/",
            NEXT_PUBLIC_CLOUDFRONT_URL: "https://mock-bucket.test/assets/",
            NEXT_PUBLIC_API_MOCKING: "disabled",
            REST_API_URL: "https://api.mock.test/v1/",
            REGION_AWS: "us-west-2",
            COGNITO_CLIENT_ID: "mock-client-id-XXXX",
            NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS: "wordless.nozomi@example.com",
            NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD: "1234567XXX",
            NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_ID: "@sample_user_id_1",
            NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_SUB: "mock-sub-1",
            NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS: "wordless.nico@example.com",
            NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD: "1234567YYY",
            NEXT_PUBLIC_SAMPLE_USER_NICO_USER_ID: "@sample_user_id_2",
            NEXT_PUBLIC_SAMPLE_USER_NICO_USER_SUB: "mock-sub-2"
        }
    }
});
