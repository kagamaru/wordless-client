"use client";

import { useState } from "react";
import { EmotePostDrawer } from "@/components/organisms";
import { useRouter } from "next/navigation";

export default function PostPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const onCloseAction = () => {
        router.back();
        setIsOpen(false);
    };

    return (
        <>
            <EmotePostDrawer isOpen={isOpen} onCloseAction={onCloseAction} />
        </>
    );
}
