import "@/layouts/globals.css";
import "@/layouts/font.css";
import "@/layouts/spacing.css";
import type { Metadata } from "next";
import { ProviderTemplate, UserInfoTemplate } from "@/components/template";

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
                    <ProviderTemplate>
                        <UserInfoTemplate>{children}</UserInfoTemplate>
                    </ProviderTemplate>
                </main>
            </body>
        </html>
    );
}
