import { ErrorBoundary, UserInfoTemplate, WebSocketProvider } from "@/components/template";
import { PageTemplate } from "@/components/template/PageTemplate";

export default function MainLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary>
            <UserInfoTemplate>
                <WebSocketProvider>
                    <PageTemplate>{children}</PageTemplate>
                </WebSocketProvider>
            </UserInfoTemplate>
        </ErrorBoundary>
    );
}
