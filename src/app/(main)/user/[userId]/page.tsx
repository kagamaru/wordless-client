"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FetchFollowResponse, User, UserSukiEmojis } from "@/@types";
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
import { UserInfoContext } from "@/components/template";
import { deleteNextjsServer, fetchNextjsServer, getHeader, postNextjsServer } from "@/helpers";
import { useError } from "@/hooks";
import { useEmoteStore } from "@/store";

export default function UserPage() {
    const { userId } = useParams();
    if (typeof userId !== "string") {
        throw new Error("userId is not a string");
    }
    const { handledError, handleErrors, hasError: hasErrorOnUserPage } = useError();
    const currentUserInfo = useContext(UserInfoContext)?.userInfo;

    const [emotes, setEmotes] = useState<Emote[]>([]);
    const [isFollowersDrawerOpen, setIsFollowersDrawerOpen] = useState(false);
    const [isFollowingDrawerOpen, setIsFollowingDrawerOpen] = useState(false);
    const [hasLastEmoteFetched, setHasLastEmoteFetched] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followResponseState, setFollowResponseState] = useState<FetchFollowResponse | null>(null);

    let numberOfCompletedAcquisitionsCompleted = 10;

    const {
        data: fetchedEmotes,
        refetch: refetchEmotes,
        isError: isFetchedEmotesError,
        error: fetchedEmotesError,
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
        data: followResponse,
        isError: isFollowError,
        error: followError
    } = useQuery({
        queryKey: ["follow"],
        queryFn: async () => {
            const response = await fetchNextjsServer<FetchFollowResponse>(`/api/follow/${userId}`, getHeader());
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
        data: profileUserInfo,
        isError: isProfileUserInfoError,
        error: profileUserInfoError
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
                return response.data;
            } else {
                return null;
            }
        },
        retry: 0
    });

    const {
        data: postFollowResponse,
        mutateAsync: postFollow,
        isError: isPostFollowError,
        error: postFollowError
    } = useMutation({
        mutationFn: async () => {
            const response = await postNextjsServer<FetchFollowResponse>(
                `/api/follow/${userId}`,
                {
                    followerId: currentUserInfo?.userId
                },
                getHeader()
            );
            return response.data;
        },
        retry: 0
    });

    const {
        data: unFollowResponse,
        mutateAsync: unFollow,
        isError: isUnFollowError,
        error: unFollowError
    } = useMutation({
        mutationFn: async () => {
            const response = await deleteNextjsServer<FetchFollowResponse>(
                `/api/follow/${userId}`,
                {
                    followerId: currentUserInfo?.userId
                },
                getHeader()
            );
            return response.data;
        },
        retry: 0
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

    const onPostFollowButtonClickAction = async () => {
        try {
            await postFollow();
        } catch (error) {
            console.error("onPostFollowButtonClickActionError");
        }
    };

    const onUnFollowButtonClickAction = async () => {
        try {
            await unFollow();
        } catch (error) {
            console.error("onUnFollowButtonClickActionError");
        }
    };

    useEffect(() => {
        const errors = [
            { isError: isFetchedEmotesError, error: fetchedEmotesError },
            { isError: isProfileUserInfoError, error: profileUserInfoError },
            { isError: isFollowError, error: followError },
            { isError: isUserSukiError, error: userSukiError },
            { isError: isFetchingMoreEmotesError, error: fetchingMoreEmotesError },
            { isError: isPostFollowError, error: postFollowError },
            { isError: isUnFollowError, error: unFollowError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                handleErrors(JSON.parse(error.message));
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
        fetchingMoreEmotesError,
        isPostFollowError,
        postFollowError,
        isUnFollowError,
        unFollowError
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

    const updateFollowState = (response: FetchFollowResponse | undefined) => {
        if (response) {
            setIsFollowing(response.followeeUserIds.includes(currentUserInfo?.userId ?? ""));
            setFollowResponseState(response);
        }
    };

    useEffect(() => {
        updateFollowState(followResponse);
    }, [followResponse]);

    useEffect(() => {
        updateFollowState(postFollowResponse);
    }, [postFollowResponse]);

    useEffect(() => {
        updateFollowState(unFollowResponse);
    }, [unFollowResponse]);

    useEffect(() => {
        useEmoteStore.getState().cleanAllData();
    }, []);

    return (
        <>
            <div className="p-4 mt-1">
                {hasErrorOnUserPage && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                {profileUserInfo && <UserProfile userInfo={profileUserInfo} />}
                <FollowButtonSection
                    totalNumberOfFollowees={followResponseState?.totalNumberOfFollowees ?? 0}
                    onFolloweesClickAction={() => {
                        setIsFollowersDrawerOpen(true);
                    }}
                    totalNumberOfFollowing={followResponseState?.totalNumberOfFollowing ?? 0}
                    onFollowingClickAction={() => {
                        setIsFollowingDrawerOpen(true);
                    }}
                />
                <UserSukiSection userSukiEmojis={userSukiResponse?.userSuki ?? []} />
                <ShadowDivider />
            </div>
            {isPending && <LoadingSpin />}
            {!isFetchedEmotesError &&
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
            <FixedFloatingFollowButton
                isFollowing={isFollowing}
                onPostFollowButtonClickAction={onPostFollowButtonClickAction}
                onUnFollowButtonClickAction={onUnFollowButtonClickAction}
            />
            {isFollowersDrawerOpen && (
                <FollowUsersDrawer
                    isOpen={isFollowersDrawerOpen}
                    setIsOpenAction={setIsFollowersDrawerOpen}
                    userIds={followResponseState?.followeeUserIds ?? []}
                    isFollowers={true}
                />
            )}
            {isFollowingDrawerOpen && (
                <FollowUsersDrawer
                    isOpen={isFollowingDrawerOpen}
                    setIsOpenAction={setIsFollowingDrawerOpen}
                    userIds={followResponseState?.followingUserIds ?? []}
                    isFollowers={false}
                />
            )}
        </>
    );
}
