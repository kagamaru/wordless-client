"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmoteService } from "@/app/api";
import { DisplayErrorMessage } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";

export default function Home() {
    const { handledError, handleErrors } = useError();
    const emotes = useEmoteStore((state) => state.emotes);

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
        if (data) {
            useEmoteStore.setState({ emotes: data.emotes });
        }
    }, [data]);

    return (
        <>
            <PageHeader></PageHeader>
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {emotes && <WordlessEmotes emotes={emotes}></WordlessEmotes>}
        </>
    );
}
