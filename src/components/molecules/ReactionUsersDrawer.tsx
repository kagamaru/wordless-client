"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Drawer, Avatar, Row, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { EmojiString, EmoteReactionEmojiWithNumber, User } from "@/@types";
import { UserService } from "@/app/api";
import { CloseButton, DisplayErrorMessage, Emoji } from "@/components/atoms";
import { useError } from "@/hooks";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    setIsOpenAction: (isOpen: boolean) => void;
};

type EmojiUsersMap = Map<EmojiString, User[]>;

export function ReactionUsersDrawer({ isOpen, emoteReactionEmojis, setIsOpenAction }: Props) {
    const [emojiUsersMap, setEmojiUsersMap] = useState<EmojiUsersMap | undefined>(new Map());
    const { hasError, handledError } = useError();
    const closeDrawer = useCallback(() => setIsOpenAction(false), [setIsOpenAction]);

    const { data: emojiUsersMapData, isPending } = useQuery({
        queryKey: ["reactionUsers", emoteReactionEmojis],
        queryFn: async () => {
            if (emoteReactionEmojis.length === 0) {
                return new Map<EmojiString, User[]>();
            }

            const userService = new UserService();
            const token = localStorage.getItem("IdToken") ?? "";

            const allPromises: Promise<[EmojiString, User]>[] = [];

            for (const emoteReactionEmoji of emoteReactionEmojis) {
                for (const userId of emoteReactionEmoji.reactedUserIds) {
                    const promise = userService.findUser(userId, token).then((user) => {
                        // NOTE： タプルであると明示する
                        return [emoteReactionEmoji.emojiId, user] as [EmojiString, User];
                    });
                    allPromises.push(promise);
                }
            }

            const results = await Promise.all(allPromises);

            const emojiUsersMap = new Map<EmojiString, User[]>();

            for (const [emojiId, user] of results) {
                if (!emojiUsersMap.has(emojiId)) {
                    emojiUsersMap.set(emojiId, []);
                }
                emojiUsersMap.get(emojiId)?.push(user);
            }

            return emojiUsersMap;
        },
        enabled: isOpen
    });

    useEffect(() => {
        if (emojiUsersMapData) {
            setEmojiUsersMap(emojiUsersMapData);
        }
    }, [emojiUsersMapData, isOpen]);

    const drawerTitle = css({
        fontSize: 16,
        fontWeight: 600
    });

    const userItem = css({
        display: "flex",
        alignItems: "center",
        marginBottom: 4,
        textDecoration: "none"
    });

    const userInfoText = css({
        marginLeft: 2,
        color: "black"
    });

    const textWrapper = css({
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        maxWidth: "150px"
    });

    const userNameText = css({
        fontSize: 14,
        fontWeight: 600
    });

    const userIdText = css({
        fontSize: 12,
        color: "gray"
    });

    const UserInfo = ({ userName, userId }: { userName: string; userId: string }) => (
        <div className={userInfoText}>
            <div className={`${textWrapper} ${userNameText}`}>{userName}</div>
            <div className={`${textWrapper} ${userIdText}`}>{userId}</div>
        </div>
    );

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                {hasError ? (
                    <>
                        <CloseButton onClickAction={closeDrawer} />
                        <DisplayErrorMessage error={handledError} />
                    </>
                ) : (
                    <>
                        <Row justify="space-between" align="middle">
                            <div className={drawerTitle}>リアクションしたユーザー</div>
                            <CloseButton onClickAction={closeDrawer} />
                        </Row>
                        <div style={{ padding: 16 }}>
                            {isPending ? (
                                <Typography.Text>読み込み中...</Typography.Text>
                            ) : emojiUsersMap && emojiUsersMap.size > 0 ? (
                                Array.from(emojiUsersMap).map(([emojiId, users]) => (
                                    <div key={emojiId}>
                                        <Emoji emojiId={emojiId} size={24} />
                                        <div style={{ padding: 8 }}>
                                            {users.map((user) => (
                                                <a
                                                    key={user.userId}
                                                    href={`/users/${user.userId}`}
                                                    className={userItem}
                                                >
                                                    <Avatar src={user.userAvatarUrl} size={48} />
                                                    <UserInfo userName={user.userName} userId={user.userId} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography.Text>リアクションしたユーザーはいません。</Typography.Text>
                            )}
                        </div>
                    </>
                )}
            </Drawer>
        </>
    );
}
