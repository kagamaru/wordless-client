"use client";

import { Col, ConfigProvider, Row } from "antd";
import dayjs from "dayjs";
import { useCallback, useContext, useMemo, useState } from "react";
import { EmoteReactionEmojiWithNumber, EmoteEmojis, EmojiString } from "@/@types";
import {
    DisplayEmoteEmoji,
    EmoteAvatar,
    EmoteReactionButton,
    PlusButton,
    TotalNumberOfReactionsButton,
    WordlessDivider
} from "@/components/atoms";
import { ReactionUsersDrawer } from "@/components/molecules";
import { EmojiDialog } from "@/components/organisms";
import { UserInfoContext, WebSocketContext } from "@/components/template";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    emote: {
        userName: string;
        userId: string;
        userAvatarUrl: string;
        emoteDatetime: string;
        emoteEmojis: EmoteEmojis;
        emoteReactionId: string;
        totalNumberOfReactions: number;
        emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    };
};

dayjs.locale("ja");

export function WordlessEmote({ emote }: Props) {
    const isMobile = useIsMobile();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEmojiDialogOpen, setIsEmojiDialogOpen] = useState(false);
    const webSocketService = useContext(WebSocketContext);
    const userInfo = useContext(UserInfoContext)?.userInfo;

    const onEmojiDialogOpen = useCallback(() => {
        setIsEmojiDialogOpen(true);
    }, []);

    const onEmojiDialogClose = useCallback(() => {
        setIsEmojiDialogOpen(false);
    }, []);

    const userId = userInfo?.userId;

    const wordlessEmoteStyle = css({
        paddingLeft: { base: "16px", lg: "140px" },
        paddingRight: { base: "16px", lg: "140px" },
        marginTop: "20px"
    });

    const textBlockStyle = css({
        marginBottom: "2px"
    });

    const userNameTextStyle = css({
        fontSize: { base: "20px", lg: "24px" },
        color: "black !important",
        marginLeft: { base: "8px", lg: "0px" },
        overflow: { base: "hidden", lg: undefined },
        textOverflow: "ellipsis",
        whiteSpace: { base: "nowrap", lg: undefined },
        maxWidth: { base: undefined, lg: "770px" },
        marginRight: { base: "0px", lg: "8px" }
    });

    const userIdTextStyle = css({
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "16px",
        color: "grey",
        marginBottom: { base: "2px", lg: "0px" }
    });

    const emoteDatetimeTextStyle = css({
        fontSize: "12px",
        color: "grey",
        marginLeft: { base: "8px", lg: "0px" },
        marginBottom: { base: "2px", lg: "4px" }
    });

    const alreadyReactedEmojiIds: Array<EmojiString> = [];

    const emoteEmojiButtons = () => (
        <Row>
            {emote?.emoteReactionEmojis.map((emoteReactionEmoji: EmoteReactionEmojiWithNumber) => {
                if (emoteReactionEmoji.reactedUserIds.length === 0) {
                    return undefined;
                }

                if (!userId) {
                    return undefined;
                }

                const isAlreadyReacted = emoteReactionEmoji.reactedUserIds.includes(userId);
                if (isAlreadyReacted) {
                    alreadyReactedEmojiIds.push(emoteReactionEmoji.emojiId);
                }

                return (
                    <EmoteReactionButton
                        key={emoteReactionEmoji.emojiId}
                        emoteReactionEmojiWithNumber={emoteReactionEmoji}
                        emoteReactionId={emote.emoteReactionId}
                        isReacted={isAlreadyReacted}
                        onClickAction={() => {
                            if (!userId) {
                                return;
                            }
                            webSocketService?.onReact({
                                emoteReactionId: emote.emoteReactionId,
                                reactedUserId: userId,
                                reactedEmojiId: emoteReactionEmoji.emojiId,
                                operation: isAlreadyReacted ? "decrement" : "increment",
                                Authorization: localStorage.getItem("IdToken") ?? ""
                            });
                        }}
                    ></EmoteReactionButton>
                );
            })}
        </Row>
    );

    const emoteEmojis = useMemo(() => {
        return emote.emoteEmojis;
    }, [emote.emoteEmojis]);

    const emoteInfo = () => {
        const emoteDatetimeFormatStyle = "YYYY-MM-DD HH:mm:ss";
        if (isMobile) {
            return (
                <div className={textBlockStyle}>
                    <div className={userNameTextStyle}>{emote.userName}</div>
                    <div className={userIdTextStyle}>{emote.userId}</div>
                    <div className={emoteDatetimeTextStyle}>
                        {dayjs(emote.emoteDatetime).format(emoteDatetimeFormatStyle)}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Row align="bottom" className={textBlockStyle}>
                        <div className={userNameTextStyle}>{emote.userName}</div>
                        <div className={userIdTextStyle}>{emote.userId}</div>
                    </Row>
                    <div className={emoteDatetimeTextStyle}>
                        {dayjs(emote.emoteDatetime).format(emoteDatetimeFormatStyle)}
                    </div>
                </div>
            );
        }
    };

    const totalNumberOfReactionsButtonClick = () => {
        setIsDrawerOpen(true);
    };

    return (
        <>
            <div className={wordlessEmoteStyle}>
                <Row>
                    <Col span={2} className="m-auto">
                        <EmoteAvatar url={emote.userAvatarUrl} userName={emote.userName}></EmoteAvatar>
                    </Col>
                    <Col span={22}>
                        {emoteInfo()}
                        <WordlessDivider />
                        <DisplayEmoteEmoji emojis={emoteEmojis}></DisplayEmoteEmoji>
                        {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                        <ConfigProvider wave={{ disabled: true }}>
                            {emote.totalNumberOfReactions > 0 && (
                                <TotalNumberOfReactionsButton
                                    totalNumberOfReactions={emote.totalNumberOfReactions}
                                    onClickAction={totalNumberOfReactionsButtonClick}
                                />
                            )}
                        </ConfigProvider>
                        <Row className={"mb-3"}>
                            <Col span={isMobile ? 3 : 1}>
                                {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                                <ConfigProvider wave={{ disabled: true }}>
                                    <PlusButton onClickAction={onEmojiDialogOpen}></PlusButton>
                                </ConfigProvider>
                            </Col>
                            <Col span={isMobile ? 21 : 23}>
                                <ConfigProvider wave={{ disabled: true }}>{emoteEmojiButtons()}</ConfigProvider>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <WordlessDivider />
                <ReactionUsersDrawer
                    isOpen={isDrawerOpen}
                    emoteReactionEmojis={emote.emoteReactionEmojis}
                    setIsOpenAction={setIsDrawerOpen}
                />
                <EmojiDialog
                    emoteReactionId={emote.emoteReactionId}
                    isOpen={isEmojiDialogOpen}
                    closeDialogAction={onEmojiDialogClose}
                    alreadyReactedEmojiIds={alreadyReactedEmojiIds}
                />
            </div>
        </>
    );
}
