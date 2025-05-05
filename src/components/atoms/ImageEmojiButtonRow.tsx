import { Col, Row } from "antd";
import { EmojiButton } from "./EmojiButton";
import { useIsMobile } from "@/hooks";
import { Emoji, EmojiString } from "@/@types";

type Props = {
    emojis: Array<Emoji>;
    onClick: (emojiId: EmojiString) => void;
};

export function ImageEmojiButtonRow({ emojis, onClick }: Props) {
    const isMobile = useIsMobile();

    return (
        <Row gutter={[0, 8]}>
            {emojis.map(({ emojiId }) => (
                <Col key={emojiId} span={isMobile ? 4 : 3}>
                    <EmojiButton emojiId={emojiId} size={32} onClick={() => onClick(emojiId)} />
                </Col>
            ))}
        </Row>
    );
}
