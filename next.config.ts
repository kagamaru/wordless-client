import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // TODO: mockデータではなくなった時に消す
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "partyparrotasaservice.vercel.app",
                port: "",
                pathname: "/api/partyparrot",
                search: ""
            }
        ]
    }
};

export default nextConfig;
