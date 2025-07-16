"use client";

import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { FetchEmotesResponse } from "@/class";
import { DisplayErrorMessage, FixedFloatingButton } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer } from "@/helpers";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";
import { LoadMoreButton } from "@/components/atoms/LoadMoreButton";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const emotes = useEmoteStore((state) => state.emotes);
    const setEmotes = useEmoteStore((state) => state.setEmotes);
    const hasEmoteSet = useEmoteStore((state) => state.hasEmoteSet);

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
        retry: 0,
        enabled: !hasEmoteSet
    });

    useEffect(() => {
        if (isError && error) {
            handleErrors(JSON.parse(error.message));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error]);

    useEffect(() => {
        if (data && !hasEmoteSet) {
            setEmotes(data.emotes);
        }
    }, [data, hasEmoteSet]);

    return (
        <>
            <PageHeader></PageHeader>
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {emotes && <WordlessEmotes emotes={emotes}></WordlessEmotes>}
            <Row justify="center" align="middle" className="mt-4 mb-8">
                <LoadMoreButton isLoading={false} onClickAction={() => {}} />
            </Row>
            <FixedFloatingButton />
        </>
    );
}
