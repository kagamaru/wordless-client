"use client";

import { DisplayEmoteEmoji, EmoteAvatar, EmoteEmojiButton, PlusButton, WordlessDivider } from "@/components/atoms";
import { Col, ConfigProvider, Row } from "antd";
import { css } from "ss/css";

export function WordlessPost() {
    const wordlessPost = css({
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

    return (
        <>
            <div className={wordlessPost}>
                <Row>
                    <Col span={2} className="m-auto">
                        <EmoteAvatar></EmoteAvatar>
                    </Col>
                    <Col span={22}>
                        <Row align="bottom" className={textBlock}>
                            <div className={authorText}>Yanami Anna</div>
                            <div className={smallText}>@annna_yanami</div>
                            <div className={smallText}>2024-12-12 18:09</div>
                        </Row>
                        <WordlessDivider />
                        <DisplayEmoteEmoji emojiIds={[":dog:", ":dragon:", ":cat:", ":snake:"]}></DisplayEmoteEmoji>
                        <Row className={"mb-3"}>
                            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                            <ConfigProvider wave={{ disabled: true }}>
                                <PlusButton onClick={() => {}}></PlusButton>
                                <EmoteEmojiButton
                                    emojiId=":smile:"
                                    numberOfReactions={1}
                                    onClick={() => {}}
                                ></EmoteEmojiButton>
                                <EmoteEmojiButton
                                    emojiId=":fish:"
                                    numberOfReactions={28}
                                    onClick={() => {}}
                                ></EmoteEmojiButton>
                            </ConfigProvider>
                        </Row>
                    </Col>
                </Row>
                <WordlessDivider />
            </div>
        </>
    );
}
