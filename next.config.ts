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
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            // next server build => ignore msw/browser
            if (Array.isArray(config.resolve.alias)) {
                config.resolve.alias.push({
                    name: "msw/browser",
                    alias: false
                });
            } else {
                config.resolve.alias["msw/browser"] = false;
            }
        } else {
            // browser => ignore msw/node
            if (Array.isArray(config.resolve.alias)) {
                config.resolve.alias.push({ name: "msw/node", alias: false });
            } else {
                config.resolve.alias["msw/node"] = false;
            }
        }
        return config;
    }
};

export default nextConfig;
