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
        marginTop: isMobile ? "10px" : "16px"
    });

    const textBlockStyle = css({
        marginBottom: "2px"
    });

    const userNameTextStyle = css({
        fontSize: isMobile ? "20px" : "24px",
        color: "black !important",
        marginLeft: isMobile ? "8px" : "0px",
        overflow: isMobile ? "hidden" : undefined,
        textOverflow: "ellipsis",
        whiteSpace: isMobile ? "nowrap" : undefined,
        maxWidth: isMobile ? "56%" : "770px",
        marginRight: isMobile ? "4px" : "8px"
    });

    const userIdTextStyle = css({
        marginLeft: isMobile ? "8px" : "0px",
        fontSize: isMobile ? "14px" : "16px",
        color: "grey",
        maxWidth: isMobile ? "16%" : undefined,
        marginBottom: isMobile ? "2px" : "0px"
    });

    const emoteDatetimeTextStyle = css({
        fontSize: "12px",
        color: "grey",
        marginLeft: isMobile ? "8px" : "0px",
        marginBottom: "4px"
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
                    <Row align="middle">
                        <Col span={3}>
                            <EmoteAvatar url={emote.userAvatarUrl} userName={emote.userName}></EmoteAvatar>
                        </Col>
                        <Col span={21}>
                            <Row align="bottom">
                                <div className={userNameTextStyle}>{emote.userName}</div>
                                <div className={userIdTextStyle}>{emote.userId}</div>
                            </Row>
                            <div className={emoteDatetimeTextStyle}>
                                {dayjs(emote.emoteDatetime).format(emoteDatetimeFormatStyle)}
                            </div>
                        </Col>
                    </Row>
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
                    {!isMobile && (
                        <Col span={2} className="m-auto">
                            <EmoteAvatar url={emote.userAvatarUrl} userName={emote.userName}></EmoteAvatar>
                        </Col>
                    )}
                    <Col span={isMobile ? 24 : 22}>
                        {emoteInfo()}
                        <Row>
                            <Col span={isMobile ? 22 : 24}>
                                <WordlessDivider dashed={isMobile} />
                            </Col>
                        </Row>
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
                <WordlessDivider dashed={false} />
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
