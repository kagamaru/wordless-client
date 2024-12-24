import "@/layouts/globals.css";
import "@/layouts/font.css";
import "@/layouts/spacing.css";
import type { Metadata } from "next";

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
                <main>{children}</main>
            </body>
        </html>
    );
}
