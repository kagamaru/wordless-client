"use client";

import { useState } from "react";
import { FetchFollowResponse, User, UserSukiEmojis } from "@/@types";
import { ShadowDivider } from "@/components/atoms";
import {
    CurrentUserProfile,
    CurrentUserSukiSection,
    FollowButtonSection,
    FollowUsersDrawer
} from "@/components/molecules";

type CurrentUserInfoProps = {
    profileUserInfo: User;
    followInfo: FetchFollowResponse;
    userSukiEmojis: UserSukiEmojis;
    onUserImageChangeClickAction: (fileData: FormData) => Promise<void>;
};

export const CurrentUserInfo = ({
    profileUserInfo,
    followInfo,
    userSukiEmojis,
    onUserImageChangeClickAction
}: CurrentUserInfoProps) => {
    const [activeDrawer, setActiveDrawer] = useState<"followees" | "following" | null>(null);

    return (
        <>
            <div role="group" aria-label="ユーザー情報">
                <CurrentUserProfile userInfo={profileUserInfo} onUserImageChangeClick={onUserImageChangeClickAction} />
                <FollowButtonSection
                    totalNumberOfFollowees={followInfo.totalNumberOfFollowees}
                    onFolloweesClickAction={() => {
                        setActiveDrawer("followees");
                    }}
                    totalNumberOfFollowing={followInfo.totalNumberOfFollowing}
                    onFollowingClickAction={() => {
                        setActiveDrawer("following");
                    }}
                />
                <CurrentUserSukiSection userSukiEmojis={userSukiEmojis} />
                <ShadowDivider />
            </div>
            {activeDrawer === "followees" && (
                <FollowUsersDrawer
                    isOpen={true}
                    closeDrawerAction={() => setActiveDrawer(null)}
                    userIds={followInfo.followeeUserIds}
                    isFollowers={true}
                />
            )}
            {activeDrawer === "following" && (
                <FollowUsersDrawer
                    isOpen={true}
                    closeDrawerAction={() => setActiveDrawer(null)}
                    userIds={followInfo.followingUserIds}
                    isFollowers={false}
                />
            )}
        </>
    );
};
