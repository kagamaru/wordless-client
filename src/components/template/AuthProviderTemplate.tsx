"use client";

import { useMemo } from "react";
import { AuthProvider } from "react-oidc-context";

export default function AuthProviderTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cognitoAuthConfig = useMemo(
        () => ({
            authority: process.env.NEXT_PUBLIC_AUTHORITY,
            client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
            redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
            response_type: "code",
            scope: "email openid phone"
        }),
        []
    );

    return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
