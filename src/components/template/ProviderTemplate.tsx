"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useMock } from "@/hooks";
import envConfigMap from "envConfig";

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
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });
    const [token, setToken] = useState("");
    const isMockReady = useMock();
    const isMockEnabled = envConfigMap.get("NEXT_PUBLIC_API_MOCKING") === "enabled";

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
