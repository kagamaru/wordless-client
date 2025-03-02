"use client";

import { EmoteService } from "@/api";
import { FetchEmotesResponse } from "@/class";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useMock } from "@/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

export default function Home() {
    const [fetchEmotesResponse, setFetchEmotesResponse] = useState(new FetchEmotesResponse([]));
    const isMockReady = useMock();

    useWebSocket();

    useEffect(() => {
        (async () => {
            if (isMockReady) {
                setFetchEmotesResponse(await new EmoteService().fetchEmotes("@fuga_fuga"));
            }
        })();
    }, [isMockReady]);

    return (
        <>
            <PageHeader></PageHeader>
            <WordlessEmotes emotes={fetchEmotesResponse.emotes}></WordlessEmotes>
        </>
    );
}
