"use client";

import { EmoteService } from "@/app/api";
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
            return await new EmoteService().fetchEmotes("@fuga_fuga", localStorage.getItem("IdToken") ?? "");
        },
        retry: 0
    });

    useEffect(() => {
        if (isError && error) {
            handleErrors(error);
        }
    }, [isError, error]);

    useEffect(() => {
        try {
            webSocketOpen();
        } catch (e) {
            handleErrors(e);
        }
    }, [webSocketOpen]);

    return (
        <>
            <PageHeader></PageHeader>
            {hasWebSocketError && <DisplayErrorMessage error={webSocketError}></DisplayErrorMessage>}
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {data && <WordlessEmotes emotes={data.emotes}></WordlessEmotes>}
        </>
    );
}
