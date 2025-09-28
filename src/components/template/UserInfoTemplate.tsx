"use client";

import { createContext } from "react";
import { useUserInfo } from "@/hooks";
import { User } from "@/@types";
import { LoadingSpin } from "../atoms";

type UserInfoContextType = {
    userInfo: User | undefined;
};

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

const s3Url = process.env.NEXT_PUBLIC_S3_URL;

export function UserInfoTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: userInfo, isLoading, error } = useUserInfo();

    if (error) {
        throw new Error(JSON.parse(error.message).data);
    }

    if (isLoading) {
        return <LoadingSpin />;
    }

    const isMockEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

    if (isMockEnabled) {
        return (
            <UserInfoContext.Provider
                value={{
                    userInfo: {
                        userAvatarUrl: `${s3Url}/userProfile/fuga_fuga.png`,
                        userId: "@hoge_hoge",
                        userName: "Hoge"
                    }
                }}
            >
                {children}
            </UserInfoContext.Provider>
        );
    }
    return <UserInfoContext.Provider value={{ userInfo }}>{children}</UserInfoContext.Provider>;
}
