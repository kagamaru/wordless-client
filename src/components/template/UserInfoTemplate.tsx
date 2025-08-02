"use client";

import { createContext } from "react";
import { useUserInfo } from "@/hooks";
import { User } from "@/@types";
import { LoadingSpin } from "../atoms";

type UserInfoContextType = {
    userInfo: User | undefined;
};

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

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

    return <UserInfoContext.Provider value={{ userInfo }}>{children}</UserInfoContext.Provider>;
}
