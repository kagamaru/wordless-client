"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { CurrentUserView, OtherPageUserView, UserInfoContext } from "@/components/template";
import { useEmoteStore } from "@/store";

export default function UserPage() {
    const { userId } = useParams();
    if (!userId || typeof userId !== "string") {
        throw new Error("userId is not a string");
    }
    // NOTE: ユーザーIDがURLに含まれる場合、@が%40に変換されるため、ここで変換する
    const formattedUserId = userId.replace("%40", "@");

    const currentUserId = useContext(UserInfoContext)?.userInfo?.userId;
    if (!currentUserId) {
        throw new Error("currentUserId is not a string");
    }

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
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
