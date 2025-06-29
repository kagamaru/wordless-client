"use client";

import { Col, Row } from "antd";
import { Emoji, EmojiString } from "@/@types";
import { EmojiButton } from "@/components/atoms";
import { useIsMobile } from "@/hooks";
import { useCallback } from "react";

type Props = {
    emojis: Array<Emoji>;
    onClickAction: (emojiId: EmojiString) => void;
};

export function EmotePostEmojiButtonRow({ emojis, onClickAction }: Props) {
    const isMobile = useIsMobile();

    const onClick = useCallback(
        (emojiId: EmojiString) => {
            onClickAction(emojiId);
        },
        [onClickAction]
    );

    return (
        <Row>
            {emojis.map(({ emojiId }) => (
                <Col key={emojiId} span={isMobile ? 4 : 1}>
                    <EmojiButton emojiId={emojiId} size={24} onClickAction={() => onClick(emojiId)} />
                </Col>
            ))}
        </Row>
    );
}
