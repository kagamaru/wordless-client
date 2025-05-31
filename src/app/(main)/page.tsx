"use client";

import { useEffect } from "react";
import { EmoteService } from "@/app/api";
import { DisplayErrorMessage } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { useError } from "@/hooks";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const { handledError, handleErrors } = useError();

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

    return (
        <>
            <PageHeader></PageHeader>
            {isError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {data && <WordlessEmotes emotes={data.emotes}></WordlessEmotes>}
        </>
    );
}
