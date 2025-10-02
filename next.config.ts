import type { NextConfig } from "next";
import envConfigMap from "envConfig";

const s3Url = envConfigMap.get("NEXT_PUBLIC_S3_URL");

const nextConfig: NextConfig = {
    // TODO: mockデータではなくなった時に消す
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: s3Url.replace("https://", ""),
                port: "",
                pathname: "/**"
            }
        ]
    }
};

export default nextConfig;
