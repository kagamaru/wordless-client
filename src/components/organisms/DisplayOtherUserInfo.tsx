"use client";

import { useState } from "react";
import { FetchFollowResponse, User, UserSukiEmojis } from "@/@types";
import { ShadowDivider } from "@/components/atoms";
import { FollowButtonSection, FollowUsersDrawer, OtherUserProfile, OtherUserSukiSection } from "@/components/molecules";

type DisplayOtherUserInfoProps = {
    profileUserInfo: User;
    followInfo: FetchFollowResponse;
    userSukiEmojis: UserSukiEmojis;
};

export const DisplayOtherUserInfo = ({ profileUserInfo, followInfo, userSukiEmojis }: DisplayOtherUserInfoProps) => {
    const [activeDrawer, setActiveDrawer] = useState<"followees" | "following" | null>(null);

    return (
        <>
            <div role="group" aria-label="ユーザー情報">
                <OtherUserProfile userInfo={profileUserInfo} />
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
                <OtherUserSukiSection userSukiEmojis={userSukiEmojis} />
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
