import { Col, Row } from "antd";
import { EmojiButton } from "./EmojiButton";
import { useIsMobile } from "@/hooks";
import { Emoji, EmojiString } from "@/@types";

type Props = {
    emojis: Array<Emoji>;
    onClick: (emojiId: EmojiString) => void;
};

export function EmojiButtonRow({ emojis, onClick }: Props) {
    const isMobile = useIsMobile();

    return (
        <Row>
            {emojis.map(({ emojiId }) => (
                <Col key={emojiId} span={isMobile ? 4 : 2}>
                    <EmojiButton emojiId={emojiId} size={24} onClick={() => onClick(emojiId)} />
                </Col>
            ))}
        </Row>
    );
}
