"use client";

import { createContext } from "react";
import { useUserInfo } from "@/hooks";
import { User } from "@/@types";

type UserInfoContextType = {
    userInfo: User | undefined;
};

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export function UserInfoTemplate({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: userInfo, error } = useUserInfo();

    if (error) {
        throw new Error(JSON.parse(error.message).data);
    }

    return <UserInfoContext.Provider value={{ userInfo }}>{children}</UserInfoContext.Provider>;
}
