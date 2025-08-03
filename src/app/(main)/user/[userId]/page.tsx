"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { OtherPageUserView, UserInfoContext } from "@/components/template";
import { useEmoteStore } from "@/store";

export default function UserPage() {
    const { userId } = useParams();
    if (typeof userId !== "string") {
        throw new Error("userId is not a string");
    }

    const currentUserId = useContext(UserInfoContext)?.userInfo?.userId;
    if (!currentUserId) {
        throw new Error("currentUserId is not a string");
    }

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
    }, []);

    return (
        <>
            <OtherPageUserView currentUserId={currentUserId} otherUserId={userId} />
        </>
    );
}
