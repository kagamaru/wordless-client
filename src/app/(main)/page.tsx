"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Row } from "antd";
import { useEffect, useState } from "react";
import { FetchEmotesResponse } from "@/class";
import {
    DisplayErrorMessage,
    FixedFloatingButton,
    LastEmoteFetchedText,
    LoadingSpin,
    LoadMoreButton
} from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer } from "@/helpers";
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
                    `/api/emote?userId=${"@fuga_fuga"}&numberOfCompletedAcquisitionsCompleted=${"10"}&sequenceNumberStartOfSearch=${emotes[emotes.length - 1]?.sequenceNumber ?? ""}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: localStorage.getItem("IdToken") ?? ""
                        }
                    }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error]);

    useEffect(() => {
        if (isFetchingMoreEmotesError && fetchingMoreEmotesError) {
            handleErrors(JSON.parse(fetchingMoreEmotesError.message));
            window.scrollTo(0, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingMoreEmotesError, fetchingMoreEmotesError]);

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
            <Row justify="center" align="middle" className="mt-4 mb-8">
                {hasLastEmoteFetched ? (
                    <LastEmoteFetchedText />
                ) : (
                    <LoadMoreButton isLoading={isFetchingMoreEmotes} onClickAction={loadMoreEmotes} />
                )}
            </Row>
            <FixedFloatingButton />
        </>
    );
}
