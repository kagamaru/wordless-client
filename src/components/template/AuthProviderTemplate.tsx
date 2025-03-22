"use client";

import { useMemo } from "react";
import { AuthProvider } from "react-oidc-context";

export default function AuthProviderTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authority = process.env.NEXT_PUBLIC_AUTHORITY ?? undefined;
    const cognitoClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? undefined;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI ?? undefined;

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

    return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
