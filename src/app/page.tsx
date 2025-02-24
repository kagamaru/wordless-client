"use client";

import { EmoteService } from "@/api";
import { FetchEmotesResponse } from "@/class";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

export default function Home() {
    const [fetchEmotesResponse, setFetchEmotesResponse] = useState(new FetchEmotesResponse([]));

    useWebSocket();

    useEffect(() => {
        (async () => {
            setFetchEmotesResponse(await new EmoteService().fetchEmotes("@fuga_fuga"));
        })();
    }, []);

    return (
        <>
            <PageHeader></PageHeader>
            <WordlessEmotes emotes={fetchEmotesResponse.emotes}></WordlessEmotes>
        </>
    );
}
