import { WebSocketProvider } from "@/components/template";

export default function MainLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <WebSocketProvider>{children}</WebSocketProvider>;
}
