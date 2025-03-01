"use client";

import { EmoteReactionEmojiWithNumber } from "@/@types";
import { Emote } from "@/class";
import { DisplayEmoteEmoji, EmoteAvatar, EmoteReactionButton, PlusButton, WordlessDivider } from "@/components/atoms";
import { useIsMobile } from "@/hooks";
import { Col, ConfigProvider, Row } from "antd";
import dayjs from "dayjs";
import { css } from "ss/css";

type Props = {
    emote: Emote;
    emoteReaction: Array<EmoteReactionEmojiWithNumber>;
};

dayjs.locale("ja");

export function WordlessEmote(props: Props) {
    const isMobile = useIsMobile();

    const wordlessEmote = css({
        paddingLeft: { base: "16px", lg: "140px" },
        paddingRight: { base: "16px", lg: "140px" },
        marginTop: "20px"
    });

    const textBlock = css({
        marginBottom: "2px"
    });

    const userNameText = css({
        fontSize: { base: "20px", lg: "24px" },
        color: "black !important",
        marginLeft: { base: "8px", lg: "0px" },
        overflow: { base: "hidden", lg: undefined },
        textOverflow: "ellipsis",
        whiteSpace: { base: "nowrap", lg: undefined },
        maxWidth: { base: undefined, lg: "770px" },
        marginRight: { base: "0px", lg: "8px" }
    });

    const userIdText = css({
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "12px",
        color: "grey",
        marginBottom: { base: "2px", lg: "0px" }
    });

    const emoteDatetimeText = css({
        fontSize: "8px",
        color: "grey",
        marginLeft: { base: "8px", lg: "0px" },
        marginBottom: { base: "2px", lg: "4px" }
    });

    const { emote } = props;

    const emoteEmojiButtons = () =>
        props.emoteReaction.map((emoteReactionEmoji: EmoteReactionEmojiWithNumber) => (
            <EmoteReactionButton
                key={emoteReactionEmoji.emojiId}
                emoteReactionEmojiWithNumber={emoteReactionEmoji}
                onClick={() => {}}
            ></EmoteReactionButton>
        ));

    const emoteInfo = () => {
        const emoteDatetimeFormatStyle = "YYYY-MM-DD HH:mm:ss";
        if (isMobile) {
            return (
                <div className={textBlock}>
                    <div className={userNameText}>{emote.userName}</div>
                    <div className={userIdText}>{emote.userId}</div>
                    <div className={emoteDatetimeText}>
                        {dayjs(emote.emoteDatetime).format(emoteDatetimeFormatStyle)}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Row align="bottom" className={textBlock}>
                        <div className={userNameText}>{emote.userName}</div>
                        <div className={userIdText}>{emote.userId}</div>
                    </Row>
                    <div className={emoteDatetimeText}>
                        {dayjs(emote.emoteDatetime).format(emoteDatetimeFormatStyle)}
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className={wordlessEmote}>
                <Row>
                    <Col span={2} className="m-auto">
                        <EmoteAvatar url={emote.userAvatarUrl}></EmoteAvatar>
                    </Col>
                    <Col span={22}>
                        {emoteInfo()}
                        <WordlessDivider />
                        <DisplayEmoteEmoji emojis={emote.emoteEmojis}></DisplayEmoteEmoji>
                        <Row className={"mb-3"}>
                            <Col span={isMobile ? 3 : 1}>
                                {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                                <ConfigProvider wave={{ disabled: true }}>
                                    <PlusButton onClick={() => {}}></PlusButton>
                                </ConfigProvider>
                            </Col>
                            <Col span={isMobile ? 21 : 23}>
                                <ConfigProvider wave={{ disabled: true }}>{emoteEmojiButtons()}</ConfigProvider>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <WordlessDivider />
            </div>
        </>
    );
}
