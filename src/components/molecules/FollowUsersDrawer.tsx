"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { Drawer, Avatar, Row } from "antd";
import { User } from "@/@types";
import { CloseButton, DisplayErrorMessage, LoadingSpin } from "@/components/atoms";
import { fetchNextjsServer, getHeader } from "@/helpers";
import { css } from "ss/css";
import { useError } from "@/hooks";

type Props = {
    isOpen: boolean;
    setIsOpenAction: (isOpen: boolean) => void;
    userIds: string[];
    isFollowers: boolean;
};

export function FollowUsersDrawer({ isOpen, setIsOpenAction, userIds, isFollowers }: Props) {
    const { handledError, handleErrors } = useError();
    const hasUserInfo = userIds.length > 0;

    const closeDrawer = useCallback(() => setIsOpenAction(false), [setIsOpenAction]);

    const {
        data: usersInfo,
        isError: isUserInfoError,
        error: userInfoError,
        isPending: isUserInfoPending
    } = useQuery({
        queryKey: ["userInfo", userIds],
        queryFn: async () => {
            if (!hasUserInfo) {
                return [];
            }
            const response = await Promise.all(
                userIds.map((userId) => fetchNextjsServer<User>(`/api/user/${userId}`, getHeader()))
            );
            return response.map((response) => response.data);
        },
        enabled: hasUserInfo
    });

    const drawerTitleStyle = css({
        fontSize: 16,
        fontWeight: 600
    });

    const userItemStyle = css({
        display: "flex",
        alignItems: "center",
        marginBottom: 4,
        textDecoration: "none"
    });

    const userInfoStyle = css({
        marginLeft: 2,
        color: "black"
    });

    const textWrapperStyle = css({
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        maxWidth: "150px"
    });

    const userNameTextStyle = css({
        fontSize: 14,
        fontWeight: 600
    });

    const userIdTextStyle = css({
        fontSize: 12,
        color: "grey"
    });

    const UserInfo = ({ userName, userId }: { userName: string; userId: string }) => (
        <div className={userInfoStyle}>
            <div className={`${textWrapperStyle} ${userNameTextStyle}`}>{userName}</div>
            <div className={`${textWrapperStyle} ${userIdTextStyle}`}>{userId}</div>
        </div>
    );

    useEffect(() => {
        if (isUserInfoError && userInfoError) {
            handleErrors(JSON.parse(userInfoError.message));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserInfoError, userInfoError]);

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                <CloseButton onClickAction={closeDrawer} />
                <Row justify="space-between" align="middle">
                    <div className={drawerTitleStyle}>{isFollowers ? "フォロワー" : "フォロー中のユーザー"}</div>
                </Row>
                {isUserInfoError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                {isUserInfoPending && hasUserInfo && <LoadingSpin />}
                {hasUserInfo ? (
                    <div style={{ padding: 16 }}>
                        {usersInfo?.map((user) => (
                            <div key={user.userId}>
                                <div style={{ padding: 8 }}>
                                    <a
                                        key={user.userId}
                                        href={`/user/${user.userId}`}
                                        className={userItemStyle}
                                        aria-label={`${user.userName}のページへ移動`}
                                    >
                                        <Avatar
                                            src={user.userAvatarUrl}
                                            size={48}
                                            alt={user.userName + "のプロフィール画像"}
                                        />
                                        <UserInfo userName={user.userName} userId={user.userId} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: 16 }}>
                        {isFollowers ? "フォロワーがいません" : "フォロー中のユーザーがいません"}
                    </div>
                )}
            </Drawer>
        </>
    );
}
