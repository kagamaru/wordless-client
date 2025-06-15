import { ErrorBoundary, UserInfoTemplate, WebSocketProvider } from "@/components/template";

export default function MainLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary>
            <UserInfoTemplate>
                <WebSocketProvider>{children}</WebSocketProvider>
            </UserInfoTemplate>
        </ErrorBoundary>
    );
}
