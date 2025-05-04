import { EmojiString } from "@/@types";
import { Emoji } from "./Emoji";
import { css } from "ss/css";

type Props = {
    emojiId: EmojiString;
    size: number;
    onClick: () => void;
};

export function EmojiButton({ emojiId, size, onClick }: Props) {
    const emojiButton = css({
        cursor: "pointer"
    });

    return (
        <span className={emojiButton} onClick={onClick}>
            <Emoji key={emojiId} emojiId={emojiId} size={size} />
        </span>
    );
}
