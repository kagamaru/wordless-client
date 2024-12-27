"use client";

import { EmoteReactionEmojiWithNumber } from "@/@types";
import { Emote } from "@/@types/Emote";
import { EmoteReaction } from "@/@types/EmoteReaction";
import { DisplayEmoteEmoji, EmoteAvatar, EmoteReactionButton, PlusButton, WordlessDivider } from "@/components/atoms";
import { Col, ConfigProvider, Row } from "antd";
import { css } from "ss/css";

type Props = {
    emote: Emote;
    emoteReaction: EmoteReaction;
};

export function WordlessEmote(props: Props) {
    const wordlessEmote = css({
        paddingLeft: { base: "16px", lg: "140px" },
        paddingRight: { base: "16px", lg: "140px" },
        marginTop: "20px"
    });

    const textBlock = css({
        marginBottom: "2px"
    });

    const authorText = css({
        fontSize: { base: "24px", lg: "28px" },
        color: "black !important",
        marginLeft: { base: "8px", lg: "0px" }
    });

    const smallText = css({
        marginBottom: { base: "4px", lg: "7px" },
        marginLeft: { base: "8px", lg: "20px" },
        fontSize: "12px",
        color: "grey"
    });

    const { emote } = props;

    const emoteEmojiButtons = () =>
        props.emoteReaction.emoteReactionEmojis.map((emoteReactionEmoji: EmoteReactionEmojiWithNumber) => (
            <EmoteReactionButton
                key={emoteReactionEmoji.emojiId}
                emoteReactionEmojiWithNumber={emoteReactionEmoji}
                onClick={() => {}}
            ></EmoteReactionButton>
        ));

    return (
        <>
            <div className={wordlessEmote}>
                <Row>
                    <Col span={2} className="m-auto">
                        <EmoteAvatar url={emote.userAvatarUrl}></EmoteAvatar>
                    </Col>
                    <Col span={22}>
                        <Row align="bottom" className={textBlock}>
                            <div className={authorText}>{emote.userName}</div>
                            <div className={smallText}>{emote.userId}</div>
                            <div className={smallText}>{emote.emoteDatetime}</div>
                        </Row>
                        <WordlessDivider />
                        <DisplayEmoteEmoji emojis={emote.emoteEmojis}></DisplayEmoteEmoji>
                        <Row className={"mb-3"}>
                            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                            <ConfigProvider wave={{ disabled: true }}>
                                <PlusButton onClick={() => {}}></PlusButton>
                                {emoteEmojiButtons()}
                            </ConfigProvider>
                        </Row>
                    </Col>
                </Row>
                <WordlessDivider />
            </div>
        </>
    );
}
