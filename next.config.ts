import type { NextConfig } from "next";

const s3Url = process.env.NEXT_PUBLIC_S3_URL;

if (!s3Url) {
    throw new Error("NEXT_PUBLIC_S3_URL is not set");
}

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
