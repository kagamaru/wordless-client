"use client";

import { Button } from "antd";
import { Emoji } from "@/components/atoms";
import { EmoteReactionEmojiWithNumber } from "@/@types";
import { css } from "ss/css";

type Props = {
    emoteReactionEmojiWithNumber: EmoteReactionEmojiWithNumber;
    emoteReactionId: string;
    onClickAction: () => void;
    isReacted: boolean;
};

export function EmoteReactionButton({
    emoteReactionEmojiWithNumber,
    emoteReactionId,
    onClickAction,
    isReacted
}: Props) {
    const emojiButton = css({
        height: "32pxt",
        width: "72px",
        marginTop: "4px",
        marginLeft: "4px",
        borderColor: isReacted ? "primary !important" : "",
        backgroundColor: isReacted ? "lightPurple !important" : ""
    });

    const numberOfReactionsCSS = css({
        fontSize: "12px",
        fontWeight: "bold"
    });

    const numberOfReactionsText = (numReactions: number) => {
        if (numReactions > 99) {
            return <span className={numberOfReactionsCSS}>99+</span>;
        } else {
            return <span>{numReactions}</span>;
        }
    };

    return (
        <>
            <Button
                aria-label={emoteReactionId + emoteReactionEmojiWithNumber.emojiId}
                shape="round"
                className={emojiButton}
                onClick={onClickAction}
                aria-pressed={isReacted}
            >
                <Emoji emojiId={emoteReactionEmojiWithNumber.emojiId} size={24} />
                {numberOfReactionsText(emoteReactionEmojiWithNumber.numberOfReactions)}
            </Button>
        </>
    );
}
