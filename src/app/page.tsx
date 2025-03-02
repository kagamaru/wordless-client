"use client";

import { EmoteService } from "@/api";
import { FetchEmotesResponse } from "@/class";
import { DisplayErrorMessage } from "@/components/atoms/DisplayErrorMessage";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useError, useMock } from "@/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

export default function Home() {
    const [fetchEmotesResponse, setFetchEmotesResponse] = useState(new FetchEmotesResponse([]));
    const isMockReady = useMock();
    const { hasError, error, handleErrors } = useError();
    const { hasWebSocketError, webSocketError, webSocketOpen } = useWebSocket();

    useEffect(() => {
        (async () => {
            try {
                if (isMockReady) {
                    webSocketOpen();
                    setFetchEmotesResponse(await new EmoteService().fetchEmotes("@fuga_fuga"));
                }
            } catch (e) {
                handleErrors(e);
            }
        })();
    }, [isMockReady]);

    return (
        <>
            <PageHeader></PageHeader>
            {hasWebSocketError && <DisplayErrorMessage error={webSocketError}></DisplayErrorMessage>}
            {hasError && <DisplayErrorMessage error={error}></DisplayErrorMessage>}
            <WordlessEmotes emotes={fetchEmotesResponse.emotes}></WordlessEmotes>
        </>
    );
}
