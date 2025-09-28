"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserSukiPostDrawer } from "@/components/organisms";
import { useEmoteStore } from "@/store";

export default function UserSukiRegistrationPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const onCloseAction = () => {
        router.back();
        setIsOpen(false);
    };

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
    }, []);

    return (
        <>
            <UserSukiPostDrawer isOpen={isOpen} onCloseAction={onCloseAction} />
        </>
    );
}
