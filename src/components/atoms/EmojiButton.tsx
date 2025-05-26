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
    const emojiButton = css({
        cursor: "pointer"
    });

    return (
        <span className={emojiButton} onClick={() => onClickAction(emojiId)}>
            <Emoji emojiId={emojiId} size={size} />
        </span>
    );
}
