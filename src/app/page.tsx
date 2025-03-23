"use client";

import { EmoteService } from "@/api";
import { DisplayErrorMessage } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useError, useMock } from "@/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const isMockReady = useMock();
    const { hasWebSocketError, webSocketError, webSocketOpen } = useWebSocket();

    const { data, isError, error } = useQuery({
        queryKey: ["emotes"],
        queryFn: async () => {
            return await new EmoteService().fetchEmotes("@fuga_fuga");
        },
        retry: 0
    });

    useEffect(() => {
        handleErrors(error);
    }, [isError]);

    useEffect(() => {
        (async () => {
            try {
                if (isMockReady) {
                    webSocketOpen();
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
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {data && <WordlessEmotes emotes={data.emotes}></WordlessEmotes>}
        </>
    );
}
