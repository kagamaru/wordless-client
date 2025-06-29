"use client";

import { Col, Row } from "antd";
import { EmojiButton } from "./EmojiButton";
import { useIsMobile } from "@/hooks";
import { Emoji, EmojiString } from "@/@types";

type Props = {
    emojis: Array<Emoji>;
    onClickAction: (emojiId: EmojiString) => void;
};

export function EmotePostImageEmojiButtonRow({ emojis, onClickAction }: Props) {
    const isMobile = useIsMobile();

    return (
        <Row gutter={[0, 8]}>
            {emojis.map(({ emojiId }) => (
                <Col key={emojiId} span={isMobile ? 4 : 1}>
                    <EmojiButton emojiId={emojiId} size={32} onClickAction={() => onClickAction(emojiId)} />
                </Col>
            ))}
        </Row>
    );
}
