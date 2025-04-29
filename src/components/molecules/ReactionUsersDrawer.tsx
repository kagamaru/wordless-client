import React from "react";
import { Drawer, Avatar, Button, Row, ConfigProvider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { css } from "ss/css";
import { EmojiString, EmoteReactionEmojiWithNumber, User } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/app/api";
import { Emoji } from "../atoms";

type Props = {
    isOpen: boolean;
    emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    setIsOpen: (isOpen: boolean) => void;
};

type EmojiUsersMap = Map<EmojiString, User[]>;

export function ReactionUsersDrawer({ isOpen, emoteReactionEmojis, setIsOpen }: Props) {
    const closeDrawer = () => setIsOpen(false);

    // TODO: エラーハンドリングを追加する
    const { data: emojiUsersMap } = useQuery({
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

    const drawerTitle = css({
        fontSize: 16,
        fontWeight: 600
    });

    const closeButton = css({
        display: "flex",
        justifyContent: "flex-end"
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

    const userNameText = css({
        fontSize: 14,
        fontWeight: 600,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        maxWidth: "150px"
    });

    const userIdText = css({
        fontSize: 12,
        color: "gray",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        maxWidth: "150px"
    });

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                <Row justify="space-between" align="middle">
                    <div className={drawerTitle}>リアクションしたユーザー</div>
                    <div className={closeButton}>
                        {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                        <ConfigProvider wave={{ disabled: true }}>
                            <Button icon={<CloseOutlined />} onClick={closeDrawer} />
                        </ConfigProvider>
                    </div>
                </Row>
                <div style={{ padding: 16 }}>
                    {emojiUsersMap && emojiUsersMap.size > 0 ? (
                        Array.from(emojiUsersMap).map(([emojiId, users]) => (
                            <div key={emojiId}>
                                <Emoji emojiId={emojiId} size={24} />
                                <div style={{ padding: 8 }}>
                                    {users.map((user) => (
                                        <a key={user.userId} href={`/users/${user.userId}`} className={userItem}>
                                            <Avatar src={user.userAvatarUrl} size={48} />
                                            <div className={userInfoText}>
                                                <div className={userNameText}>{user.userName}</div>
                                                <div className={userIdText}>{user.userId}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <Typography.Text>リアクションしたユーザーはいません。</Typography.Text>
                    )}
                </div>
            </Drawer>
        </>
    );
}
