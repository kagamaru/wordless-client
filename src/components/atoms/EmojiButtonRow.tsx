import { Col, Row } from "antd";
import { EmojiButton } from "./EmojiButton";
import { Emoji, EmojiString } from "@/@types";

type Props = {
    emojis: Array<Emoji>;
    onClick: (emojiId: EmojiString) => void;
};

export function EmojiButtonRow({ emojis, onClick }: Props) {
    return (
        <Row>
            {emojis.map((emoji) => (
                <Col key={emoji.emojiId} span={2}>
                    <EmojiButton emojiId={emoji.emojiId} size={24} onClick={() => onClick(emoji.emojiId)} />
                </Col>
            ))}
        </Row>
    );
}
