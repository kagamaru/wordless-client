"use client";

import { ConfigProvider } from "antd";
import { useMemo, useRef } from "react";
import { AuthProvider } from "react-oidc-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ProviderTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authority = process.env.NEXT_PUBLIC_AUTHORITY ?? undefined;
    const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? undefined;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI ?? undefined;
    const queryClient = new QueryClient();
    const providerTemplateRef = useRef<React.ReactElement | undefined>(undefined);

    if (!authority || !cognitoClientId || !redirectUri) {
        throw new Error("必要な環境変数が設定されていません");
    }

    const cognitoAuthConfig = useMemo(
        () => ({
            authority: authority,
            client_id: cognitoClientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "email openid phone"
        }),
        [authority, cognitoClientId, redirectUri]
    );

    if (!providerTemplateRef.current) {
        providerTemplateRef.current = (
            <AuthProvider {...cognitoAuthConfig}>
                <QueryClientProvider client={queryClient}>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#7829cc"
                            }
                        }}
                    >
                        {children}
                    </ConfigProvider>
                </QueryClientProvider>
                ;
            </AuthProvider>
        );
    }

    return providerTemplateRef.current;
}
