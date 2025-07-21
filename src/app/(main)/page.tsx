"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FetchEmotesResponse } from "@/class";
import { DisplayErrorMessage, FixedFloatingButton, LoadingSpin } from "@/components/atoms";
import { EndOfEmotes } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer, getHeader } from "@/helpers";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const emotes = useEmoteStore((state) => state.emotes);
    const setEmotes = useEmoteStore((state) => state.setEmotes);
    const hasEmoteSet = useEmoteStore((state) => state.hasEmoteSet);
    const [hasLastEmoteFetched, setHasLastEmoteFetched] = useState(false);

    const { data, isError, error, isPending } = useQuery({
        queryKey: ["emotes"],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchEmotesResponse>(
                `/api/emote?numberOfCompletedAcquisitionsCompleted=${"10"}`,
                getHeader()
            );
            return response.data;
        },
        retry: 0,
        enabled: !hasEmoteSet
    });

    const {
        data: moreEmotes,
        mutateAsync: fetchMoreEmotes,
        isPending: isFetchingMoreEmotes,
        isError: isFetchingMoreEmotesError,
        error: fetchingMoreEmotesError
    } = useMutation({
        mutationFn: async () => {
            if (emotes && emotes.length > 0) {
                const response = await fetchNextjsServer<FetchEmotesResponse>(
                    `/api/emote?numberOfCompletedAcquisitionsCompleted=${"10"}&sequenceNumberStartOfSearch=${emotes[emotes.length - 1]?.sequenceNumber ?? ""}`,
                    getHeader()
                );
                return response;
            } else {
                return null;
            }
        },
        retry: 0
    });

    const loadMoreEmotes = async () => {
        try {
            await fetchMoreEmotes();
        } catch (error) {
            console.error("loadMoreEmotesError");
        }
    };

    useEffect(() => {
        if (isError && error) {
            handleErrors(JSON.parse(error.message));
        }
        if (isFetchingMoreEmotesError && fetchingMoreEmotesError) {
            handleErrors(JSON.parse(fetchingMoreEmotesError.message));
            window.scrollTo(0, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error, isFetchingMoreEmotesError, fetchingMoreEmotesError]);

    useEffect(() => {
        if (data && !hasEmoteSet) {
            setEmotes(data.emotes);
        }
    }, [data, hasEmoteSet]);

    useEffect(() => {
        if (moreEmotes && moreEmotes.data && moreEmotes.data.emotes.length > 0) {
            setEmotes([...emotes, ...moreEmotes.data.emotes]);
        } else if (moreEmotes && moreEmotes.data && moreEmotes.data.emotes.length === 0) {
            setHasLastEmoteFetched(true);
        }
    }, [moreEmotes]);

    return (
        <>
            {(isError || isFetchingMoreEmotesError) && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {isPending && <LoadingSpin />}
            {emotes && <WordlessEmotes emotes={emotes}></WordlessEmotes>}
            <EndOfEmotes
                hasLastEmoteFetched={hasLastEmoteFetched}
                isFetchingMoreEmotes={isFetchingMoreEmotes}
                loadMoreEmotesAction={loadMoreEmotes}
            />
            <FixedFloatingButton />
        </>
    );
}
