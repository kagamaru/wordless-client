"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Drawer, Avatar, Row, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { EmojiString, EmoteReactionEmojiWithNumber, User } from "@/@types";
import { UserService } from "@/app/api";
import { CloseButton, DisplayErrorMessageWithoutErrorCode, Emoji } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    isOpen: boolean;
    emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    setIsOpenAction: (isOpen: boolean) => void;
};

type EmojiUsersMap = Map<EmojiString, User[]>;

export function ReactionUsersDrawer({ isOpen, emoteReactionEmojis, setIsOpenAction }: Props) {
    const [emojiUsersMap, setEmojiUsersMap] = useState<EmojiUsersMap | undefined>(new Map());

    const [hasUserFetchError, setHasUserFetchError] = useState(false);

    const closeDrawer = useCallback(() => setIsOpenAction(false), [setIsOpenAction]);

    const {
        data: emojiUsersMapData,
        isPending,
        isError: allUserFetchError
    } = useQuery({
        queryKey: ["reactionUsers", emoteReactionEmojis],
        queryFn: async () => {
            if (emoteReactionEmojis.length === 0) {
                return new Map<EmojiString, User[]>();
            }

            const userService = new UserService();
            const token = localStorage.getItem("IdToken") ?? "";

            const allPromises: Promise<[EmojiString, User] | ["hasError", Error]>[] = [];

            for (const emoteReactionEmoji of emoteReactionEmojis) {
                for (const userId of emoteReactionEmoji.reactedUserIds) {
                    const promise = userService
                        .findUser(userId, token)
                        .then((user) => {
                            // NOTE： タプルであると明示する
                            return [emoteReactionEmoji.emojiId, user] as [EmojiString, User];
                        })
                        .catch((error) => {
                            return ["hasError", error] as ["hasError", Error];
                        });
                    allPromises.push(promise);
                }
            }

            const results = await Promise.all(allPromises);

            const errors = results.filter((r): r is ["hasError", Error] => r[0] === "hasError");
            if (errors.length === results.length) {
                // NOTE: 全部エラーの場合はエラーを throw して useQuery 側で isError フラグにする
                throw new Error("全てのユーザー取得に失敗しました。");
            }

            const emojiUsersMap = new Map<EmojiString, User[]>();

            for (const result of results) {
                if (result[0] === "hasError") {
                    setHasUserFetchError(true);
                    break;
                }

                const [emojiId, user] = result;
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

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                {allUserFetchError ? (
                    <>
                        <CloseButton onClickAction={closeDrawer} />
                        <DisplayErrorMessageWithoutErrorCode errorMessage="ユーザー情報の取得に失敗しました。" />
                    </>
                ) : (
                    <>
                        <Row justify="space-between" align="middle">
                            <div className={drawerTitleStyle}>リアクションしたユーザー</div>
                            <CloseButton onClickAction={closeDrawer} />
                        </Row>
                        <div style={{ padding: 16 }}>
                            {isPending && <Typography.Text>読み込み中...</Typography.Text>}
                            {!isPending && (
                                <>
                                    {hasUserFetchError && (
                                        <DisplayErrorMessageWithoutErrorCode errorMessage="情報を取得できなかったユーザーがいます。" />
                                    )}
                                    {emojiUsersMap && emojiUsersMap.size > 0 ? (
                                        Array.from(emojiUsersMap).map(([emojiId, users]) => (
                                            <div key={emojiId}>
                                                <Emoji emojiId={emojiId} size={24} />
                                                <div style={{ padding: 8 }}>
                                                    {users.map((user) => (
                                                        <a
                                                            key={user.userId}
                                                            href={`/users/${user.userId}`}
                                                            className={userItemStyle}
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
                                </>
                            )}
                        </div>
                    </>
                )}
            </Drawer>
        </>
    );
}
