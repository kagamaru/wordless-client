"use client";

import { ConfigProvider } from "antd";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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

    useEffect(() => {
        const fetchToken = async () => {
            const token = localStorage.getItem("AccessToken");
            if (!token) {
                router.push("/auth/login");
            }
        };

        fetchToken();
    }, [router]);

    return (
        <>
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
        </>
    );
}
