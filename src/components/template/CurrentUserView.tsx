"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FetchFollowResponse, User, UserSukiEmojis } from "@/@types";
import { Emote, FetchEmotesResponse } from "@/class";
import { DisplayErrorMessage, LoadingSpin, NoEmoteText } from "@/components/atoms";
import { EndOfEmotes } from "@/components/molecules";
import { CurrentUserInfo, CurrentUserWordlessEmotes, WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer, getHeader } from "@/helpers";
import { useError } from "@/hooks";

type Props = {
    currentUserId: string;
};

export const CurrentUserView = ({ currentUserId }: Props) => {
    const { handledError, handleErrors, hasError: hasErrorOnUserPage } = useError();

    const [emotes, setEmotes] = useState<Emote[]>([]);
    const [hasLastEmoteFetched, setHasLastEmoteFetched] = useState(false);
    const [followResponseState, setFollowResponseState] = useState<FetchFollowResponse | null>(null);

    let numberOfCompletedAcquisitionsCompleted = 10;

    const {
        data: fetchedEmotes,
        refetch: refetchEmotes,
        isError: isFetchedEmotesError,
        error: fetchedEmotesError,
        isPending: isFetchingEmotes
    } = useQuery({
        queryKey: ["emotes", numberOfCompletedAcquisitionsCompleted],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchEmotesResponse>(
                `/api/emote?userId=${currentUserId}&numberOfCompletedAcquisitionsCompleted=${numberOfCompletedAcquisitionsCompleted}`,
                getHeader()
            );
            return response.data;
        }
    });

    const {
        data: followResponse,
        isError: isFollowError,
        error: followError
    } = useQuery({
        queryKey: ["follow"],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchFollowResponse>(`/api/follow/${currentUserId}`, getHeader());
            return response.data;
        }
    });

    const {
        data: userSukiResponse,
        isError: isUserSukiError,
        error: userSukiError
    } = useQuery({
        queryKey: ["userSuki"],
        queryFn: async () => {
            const response = await fetchNextjsServer<{ userSuki: UserSukiEmojis }>(
                `/api/userSuki/${currentUserId}`,
                getHeader()
            );
            return response.data;
        }
    });

    const {
        data: profileUserInfo,
        isError: isProfileUserInfoError,
        error: profileUserInfoError
    } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const response = await fetchNextjsServer<User>(`/api/user/${currentUserId}`, getHeader());
            return response.data;
        }
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
                    `/api/emote?userId=${currentUserId}&numberOfCompletedAcquisitionsCompleted=${"10"}&sequenceNumberStartOfSearch=${emotes[emotes.length - 1]?.sequenceNumber ?? ""}`,
                    getHeader()
                );
                return response.data;
            } else {
                return null;
            }
        }
    });

    const onReactionClickAction = async () => {
        // TODO: リアクションしたエモートのみを取得し、反映するよう設計変更する
        // BUG: 現在はユーザーページのユーザーがエモートを新規に投稿した時に、リアクションしたエモートが表示できない可能性がある
        numberOfCompletedAcquisitionsCompleted = emotes.length;
        await refetchEmotes();
        numberOfCompletedAcquisitionsCompleted = 10;
        if (fetchedEmotes) {
            setEmotes(fetchedEmotes.emotes);
        }
    };

    const loadMoreEmotes = async () => {
        try {
            await fetchMoreEmotes();
        } catch (error) {
            console.error("loadMoreEmotesError");
        }
    };

    useEffect(() => {
        const errors = [
            { isError: isFetchedEmotesError, error: fetchedEmotesError },
            { isError: isProfileUserInfoError, error: profileUserInfoError },
            { isError: isFollowError, error: followError },
            { isError: isUserSukiError, error: userSukiError },
            { isError: isFetchingMoreEmotesError, error: fetchingMoreEmotesError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                try {
                    handleErrors(JSON.parse(error.message));
                } catch (error) {
                    console.error("Error parsing error message:", error);
                }
            }
        });

        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isFetchedEmotesError,
        fetchedEmotesError,
        isProfileUserInfoError,
        profileUserInfoError,
        isUserSukiError,
        userSukiError,
        isFollowError,
        followError,
        isFetchingMoreEmotesError,
        fetchingMoreEmotesError
    ]);

    useEffect(() => {
        if (fetchedEmotes) {
            setEmotes(fetchedEmotes.emotes);
        }
    }, [fetchedEmotes]);

    useEffect(() => {
        if (moreEmotes && moreEmotes.emotes.length > 0) {
            setEmotes([...emotes, ...moreEmotes.emotes]);
        } else if (moreEmotes && moreEmotes.emotes.length === 0) {
            setHasLastEmoteFetched(true);
        }
    }, [moreEmotes]);

    useEffect(() => {
        if (followResponse) {
            setFollowResponseState(followResponse);
        }
    }, [followResponse]);

    return (
        <>
            <div className="p-4 mt-1">
                {hasErrorOnUserPage && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                {profileUserInfo && followResponseState && userSukiResponse && (
                    <CurrentUserInfo
                        profileUserInfo={profileUserInfo}
                        followInfo={followResponseState}
                        userSukiEmojis={userSukiResponse?.userSuki ?? []}
                    />
                )}
            </div>
            {isFetchingEmotes && <LoadingSpin />}
            {!isFetchedEmotesError &&
                !isFetchingEmotes &&
                (emotes.length > 0 ? (
                    <>
                        <CurrentUserWordlessEmotes
                            emotes={emotes}
                            onReactionClickAction={onReactionClickAction}
                        ></CurrentUserWordlessEmotes>
                        <EndOfEmotes
                            hasLastEmoteFetched={hasLastEmoteFetched}
                            isFetchingMoreEmotes={isFetchingMoreEmotes}
                            loadMoreEmotesAction={loadMoreEmotes}
                        />
                    </>
                ) : (
                    <NoEmoteText />
                ))}
        </>
    );
};
