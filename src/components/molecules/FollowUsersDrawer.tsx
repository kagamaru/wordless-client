"use client";

import React, { useCallback } from "react";
import { Drawer, Avatar, Row } from "antd";
import { User } from "@/@types";
import { CloseButton } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    setIsOpenAction: (isOpen: boolean) => void;
    userIds: string[];
    isFollowers: boolean;
};

export function FollowUsersDrawer({ isOpen, setIsOpenAction, userIds, isFollowers }: Props) {
    const closeDrawer = useCallback(() => setIsOpenAction(false), [setIsOpenAction]);

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

    const usersInfo: User[] = [
        {
            userName: "ユーザー名1",
            userId: "@user1",
            userAvatarUrl: "user1.jpg"
        },
        {
            userName: "ユーザー名2",
            userId: "@user2",
            userAvatarUrl: "user2.jpg"
        }
    ];

    const UserInfo = ({ userName, userId }: { userName: string; userId: string }) => (
        <div className={userInfoStyle}>
            <div className={`${textWrapperStyle} ${userNameTextStyle}`}>{userName}</div>
            <div className={`${textWrapperStyle} ${userIdTextStyle}`}>{userId}</div>
        </div>
    );

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                <CloseButton onClickAction={closeDrawer} />
                <Row justify="space-between" align="middle">
                    <div className={drawerTitleStyle}>{isFollowers ? "フォロワー" : "フォロー中のユーザー"}</div>
                </Row>
                <div style={{ padding: 16 }}>
                    {usersInfo.map((user) => (
                        <div key={user.userId}>
                            <div style={{ padding: 8 }}>
                                <a
                                    key={user.userId}
                                    href={`/user/${user.userId}`}
                                    className={userItemStyle}
                                    aria-label={`${user.userName}のページへ移動`}
                                >
                                    <Avatar src={user.userAvatarUrl} size={48} />
                                    <UserInfo userName={user.userName} userId={user.userId} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </Drawer>
        </>
    );
}
