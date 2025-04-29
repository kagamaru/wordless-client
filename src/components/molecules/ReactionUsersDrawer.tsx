import React, { useEffect } from "react";
import { Drawer, Avatar, Row, Typography } from "antd";
import { css } from "ss/css";
import { EmojiString, EmoteReactionEmojiWithNumber, User } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/app/api";
import { CloseButton, DisplayErrorMessage, Emoji } from "@/components/atoms";
import { useError } from "@/hooks";

type Props = {
    isOpen: boolean;
    emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    setIsOpen: (isOpen: boolean) => void;
};

type EmojiUsersMap = Map<EmojiString, User[]>;

export function ReactionUsersDrawer({ isOpen, emoteReactionEmojis, setIsOpen }: Props) {
    const { handledError, handleErrors } = useError();
    const closeDrawer = () => setIsOpen(false);

    const {
        data: emojiUsersMap,
        isError,
        error
    } = useQuery({
        queryKey: ["users", emoteReactionEmojis],
        queryFn: async (): Promise<EmojiUsersMap | undefined> => {
            if (emoteReactionEmojis.length === 0) return undefined;

            const userService = new UserService();
            const token = localStorage.getItem("IdToken") ?? "";

            const result: EmojiUsersMap = new Map();

            for (const emoji of emoteReactionEmojis) {
                const userPromises = emoji.reactedUserIds.map((userId) => userService.findUser(userId, token));
                result.set(emoji.emojiId, await Promise.all(userPromises));
            }

            return result;
        },
        retry: 0,
        enabled: emoteReactionEmojis.length > 0
    });

    useEffect(() => {
        if (isError && error) {
            handleErrors(error);
        }
    }, [isError, error]);

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
                {isError ? (
                    <>
                        <CloseButton onClick={closeDrawer} />
                        <DisplayErrorMessage error={handledError} />
                    </>
                ) : (
                    <>
                        <Row justify="space-between" align="middle">
                            <div className={drawerTitle}>リアクションしたユーザー</div>
                            <CloseButton onClick={closeDrawer} />
                        </Row>
                        <div style={{ padding: 16 }}>
                            {emojiUsersMap && emojiUsersMap.size > 0 ? (
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
