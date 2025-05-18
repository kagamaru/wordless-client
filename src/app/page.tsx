"use client";

import { EmoteService, WebSocketService } from "@/app/api";
import { DisplayErrorMessage } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useError } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const idToken = localStorage.getItem("IdToken");

    const { data, isError, error } = useQuery({
        queryKey: ["emotes"],
        queryFn: async () => {
            return await new EmoteService().fetchEmotes("@fuga_fuga", idToken ?? "");
        },
        retry: 0
    });

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL + "?Authorization=" + idToken;
        new WebSocketService(url, handleErrors);
    }, []);

    useEffect(() => {
        if (isError && error) {
            handleErrors(error);
        }
    }, [isError, error]);

    return (
        <>
            <PageHeader></PageHeader>
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {data && <WordlessEmotes emotes={data.emotes}></WordlessEmotes>}
        </>
    );
}
