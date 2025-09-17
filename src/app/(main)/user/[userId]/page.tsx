"use client";

import { useContext, useEffect } from "react";
import { CurrentUserView, OtherPageUserView, UserInfoContext } from "@/components/template";
import { useEmoteStore } from "@/store";
import { useParamUserId } from "@/hooks";

export default function UserPage() {
    const formattedUserId = useParamUserId();
    const cleanAllData = useEmoteStore((state) => state.cleanAllData);

    const currentUserId = useContext(UserInfoContext)?.userInfo?.userId;
    if (!currentUserId) {
        throw new Error("currentUserId is not a string");
    }

    useEffect(() => {
        cleanAllData();
    }, []);

    return (
        <>
            {currentUserId === formattedUserId ? (
                <CurrentUserView currentUserId={currentUserId} />
            ) : (
                <OtherPageUserView currentUserId={currentUserId} otherUserId={formattedUserId} />
            )}
        </>
    );
}
