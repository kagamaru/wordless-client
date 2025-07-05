"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchEmotesResponse } from "@/class";
import { DisplayErrorMessage, FixedFloatingButton } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer } from "@/helpers";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const emotes = useEmoteStore((state) => state.emotes);

    const { data, isError, error } = useQuery({
        queryKey: ["emotes"],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchEmotesResponse>(
                `/api/emote?userId=${"@fuga_fuga"}&numberOfCompletedAcquisitionsCompleted=${"10"}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: localStorage.getItem("IdToken") ?? ""
                    }
                }
            );
            return response.data;
        },
        retry: 0
    });

    useEffect(() => {
        if (isError && error) {
            handleErrors(JSON.parse(error.message));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error]);

    useEffect(() => {
        if (data) {
            useEmoteStore.setState({ emotes: data.emotes });
        }
    }, [data]);

    return (
        <>
            <PageHeader></PageHeader>
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {emotes && <WordlessEmotes emotes={emotes}></WordlessEmotes>}
            <FixedFloatingButton />
        </>
    );
}
