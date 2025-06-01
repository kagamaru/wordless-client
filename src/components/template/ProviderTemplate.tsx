"use client";

import { ConfigProvider } from "antd";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMock } from "@/hooks";

interface AuthContextType {
    token: string;
    setToken: Dispatch<SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function ProviderTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = new QueryClient();
    const [token, setToken] = useState("");
    const router = useRouter();
    const isMockReady = useMock();
    const isMockEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

    useEffect(() => {
        const fetchToken = (): string | void => {
            const token = localStorage.getItem("IdToken");
            if (!token) {
                router.push("/auth/login");
                return;
            }
            return token;
        };

        const token = fetchToken();
        setToken(token ?? "");
    }, [router]);

    const renderProvider = () => (
        <AuthContext.Provider value={{ token, setToken }}>
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
        </AuthContext.Provider>
    );

    return (isMockEnabled && isMockReady) || !isMockEnabled ? renderProvider() : <></>;
}
