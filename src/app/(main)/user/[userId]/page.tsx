"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User, UserSukiEmojis } from "@/@types";
import { Emote, FetchEmotesResponse } from "@/class";
import {
    DisplayErrorMessage,
    FixedFloatingFollowButton,
    LoadingSpin,
    NoEmoteText,
    ShadowDivider
} from "@/components/atoms";
import {
    EndOfEmotes,
    FollowButtonSection,
    FollowUsersDrawer,
    UserProfile,
    UserSukiSection
} from "@/components/molecules";
import { WordlessEmotes } from "@/components/organisms";
import { fetchNextjsServer, getHeader } from "@/helpers";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";

export default function UserPage() {
    const { userId } = useParams();
    const { handledError, handleErrors } = useError();
    const [emotes, setEmotes] = useState<Emote[]>([]);
    const [isFollowersDrawerOpen, setIsFollowersDrawerOpen] = useState(false);
    const [isFollowingDrawerOpen, setIsFollowingDrawerOpen] = useState(false);
    const [hasLastEmoteFetched, setHasLastEmoteFetched] = useState(false);
    const followerUserIds = ["@fuga_fuga", "@hoge_hoge", "@apple"];
    const followingUserIds = ["@hoge_hoge", "@apple", "@orange"];
    let numberOfCompletedAcquisitionsCompleted = 10;

    const onFollowersButtonClick = () => {
        setIsFollowersDrawerOpen(true);
    };

    const onFollowingButtonClick = () => {
        setIsFollowingDrawerOpen(true);
    };

    const {
        data,
        refetch: refetchEmotes,
        isError,
        error,
        isPending
    } = useQuery({
        queryKey: ["emotes", numberOfCompletedAcquisitionsCompleted],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchEmotesResponse>(
                `/api/emote?userId=${userId}&numberOfCompletedAcquisitionsCompleted=${numberOfCompletedAcquisitionsCompleted}`,
                getHeader()
            );
            return response.data;
        },
        retry: 0
    });

    const {
        data: userSukiResponse,
        isError: isUserSukiError,
        error: userSukiError
    } = useQuery({
        queryKey: ["userSuki"],
        queryFn: async () => {
            const response = await fetchNextjsServer<{ userSuki: UserSukiEmojis }>(
                `/api/userSuki/${userId}`,
                getHeader()
            );
            return response.data;
        },
        retry: 0
    });

    const {
        data: userInfo,
        isError: isUserInfoError,
        error: userInfoError
    } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const response = await fetchNextjsServer<User>(`/api/user/${userId}`, getHeader());
            return response.data;
        },
        retry: 0
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
                    `/api/emote?userId=${userId}&numberOfCompletedAcquisitionsCompleted=${"10"}&sequenceNumberStartOfSearch=${emotes[emotes.length - 1]?.sequenceNumber ?? ""}`,
                    getHeader()
                );
                return response;
            } else {
                return null;
            }
        },
        retry: 0
    });

    const onReactionClickAction = async () => {
        // TODO: リアクションしたエモートのみを取得し、反映するよう設計変更する
        // BUG: 現在はユーザーページのユーザーがエモートを新規に投稿した時に、リアクションしたエモートが表示できない可能性がある
        numberOfCompletedAcquisitionsCompleted = emotes.length;
        await refetchEmotes();
        numberOfCompletedAcquisitionsCompleted = 10;
        if (data) {
            setEmotes(data.emotes);
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
            { isError: isError, error: error },
            { isError: isUserInfoError, error: userInfoError },
            { isError: isUserSukiError, error: userSukiError },
            { isError: isFetchingMoreEmotesError, error: fetchingMoreEmotesError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                handleErrors(JSON.parse(error.message));
            }
        });

        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isError,
        error,
        isUserInfoError,
        userInfoError,
        isUserSukiError,
        userSukiError,
        isFetchingMoreEmotesError,
        fetchingMoreEmotesError
    ]);

    useEffect(() => {
        if (data) {
            setEmotes(data.emotes);
        }
    }, [data]);

    useEffect(() => {
        if (moreEmotes && moreEmotes.data && moreEmotes.data.emotes.length > 0) {
            setEmotes([...emotes, ...moreEmotes.data.emotes]);
        } else if (moreEmotes && moreEmotes.data && moreEmotes.data.emotes.length === 0) {
            setHasLastEmoteFetched(true);
        }
    }, [moreEmotes]);

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
    }, []);

    return (
        <>
            <div className="p-4 mt-1">
                {(isError || isUserInfoError || isUserSukiError || isFetchingMoreEmotesError) && (
                    <DisplayErrorMessage error={handledError}></DisplayErrorMessage>
                )}
                {userInfo && <UserProfile userInfo={userInfo} />}
                <FollowButtonSection
                    totalNumberOfFollowers={100}
                    onFollowersClickAction={onFollowersButtonClick}
                    totalNumberOfFollowing={200}
                    onFollowingClickAction={onFollowingButtonClick}
                />
                <UserSukiSection userSukiEmojis={userSukiResponse?.userSuki ?? []} />
                <ShadowDivider />
            </div>
            {isPending && <LoadingSpin />}
            {!isError &&
                !isPending &&
                (emotes.length > 0 ? (
                    <>
                        <WordlessEmotes emotes={emotes} onReactionClickAction={onReactionClickAction}></WordlessEmotes>
                        <EndOfEmotes
                            hasLastEmoteFetched={hasLastEmoteFetched}
                            isFetchingMoreEmotes={isFetchingMoreEmotes}
                            loadMoreEmotesAction={loadMoreEmotes}
                        />
                    </>
                ) : (
                    <NoEmoteText />
                ))}
            <FixedFloatingFollowButton isFollowing={false} />
            {isFollowersDrawerOpen && (
                <FollowUsersDrawer
                    isOpen={isFollowersDrawerOpen}
                    setIsOpenAction={setIsFollowersDrawerOpen}
                    userIds={followerUserIds}
                    isFollowers={true}
                />
            )}
            {isFollowingDrawerOpen && (
                <FollowUsersDrawer
                    isOpen={isFollowingDrawerOpen}
                    setIsOpenAction={setIsFollowingDrawerOpen}
                    userIds={followingUserIds}
                    isFollowers={false}
                />
            )}
        </>
    );
}
