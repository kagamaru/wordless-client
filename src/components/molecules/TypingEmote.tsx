import { Row } from "antd";
import { EmojiWithDeleteButton } from "@/components/atoms";
import { useIsMobile } from "@/hooks";
import { PostEmojis } from "@/@types";
import { css } from "ss/css";

type Props = {
    postEmojis: PostEmojis;
    onEmojiDeleteClick: (index: number) => void;
};

export function TypingEmote({ postEmojis, onEmojiDeleteClick }: Props) {
    const isMobile = useIsMobile();

    const displayEmojiBlockStyle = css({
        marginRight: "8px",
        width: isMobile ? "48px" : "80px",
        height: isMobile ? "48px" : "80px",
        textAlign: "center"
    });

    const emojiBlankListItemStyle = css({
        width: isMobile ? "48px" : "80px",
        height: isMobile ? "48px" : "80px",
        marginRight: "8px",
        border: "2px dashed #888",
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    });

    return (
        <Row align="middle" style={{ fontSize: isMobile ? "28px" : "56px" }} role="listbox">
            {postEmojis.map((emoji, i) => (
                <div key={i}>
                    {emoji ? (
                        <div
                            className={displayEmojiBlockStyle}
                            role="option"
                            aria-selected={true}
                            aria-label={"入力済絵文字" + (i + 1)}
                        >
                            <EmojiWithDeleteButton
                                emojiId={emoji.emojiId}
                                size={isMobile ? 40 : 80}
                                onDeleteClick={() => onEmojiDeleteClick(i)}
                            />
                        </div>
                    ) : (
                        <div
                            className={emojiBlankListItemStyle}
                            role="option"
                            aria-label={"未入力絵文字" + (i + 1)}
                            aria-selected={false}
                        ></div>
                    )}
                </div>
            ))}
        </Row>
    );
}
