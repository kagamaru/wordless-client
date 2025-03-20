import "@/layouts/globals.css";
import "@/layouts/font.css";
import "@/layouts/spacing.css";
import type { Metadata } from "next";
import AuthProviderTemplate from "@/components/template/AuthProviderTemplate";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
    title: "Wordless",
    description: "言葉のないSNS Wordless"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body>
                <main>
                    <AuthProviderTemplate>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#7829cc"
                                }
                            }}
                        >
                            {children}
                        </ConfigProvider>
                    </AuthProviderTemplate>
                </main>
            </body>
        </html>
    );
}
