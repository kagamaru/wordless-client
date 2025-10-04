import "@/layouts/globals.css";
import "@/layouts/font.css";
import "@/layouts/spacing.css";
import type { Metadata } from "next";
import { ProviderTemplate } from "@/components/template";

export const metadata: Metadata = {
    title: "Wordless",
    description: "言葉のないSNS Wordless",
    openGraph: {
        images: [
            {
                url: "/ogp/thumbnail.png",
                width: 1200,
                height: 630
            }
        ],
        title: "Wordless",
        description: "言葉のないSNS Wordless",
        url: "",
        siteName: "Wordless",
        locale: "ja",
        type: "website"
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }
        ],
        apple: "/apple-touch-icon.png",
        shortcut: "/favicon.ico"
    }
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
                    <ProviderTemplate>{children}</ProviderTemplate>
                </main>
            </body>
        </html>
    );
}
