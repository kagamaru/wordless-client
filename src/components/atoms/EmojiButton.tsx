"use client";

import { EmojiString } from "@/@types";
import { Emoji } from "@/components/atoms";
import { css } from "ss/css";

type Props = {
    emojiId: EmojiString;
    size: number;
    onClickAction: (emojiId: EmojiString) => void;
};

export function EmojiButton({ emojiId, size, onClickAction }: Props) {
    const emojiButtonStyle = css({
        cursor: "pointer"
    });

    return (
        <span className={emojiButtonStyle} onClick={() => onClickAction(emojiId)}>
            <Emoji emojiId={emojiId} size={size} />
        </span>
    );
}
