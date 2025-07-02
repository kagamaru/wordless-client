import { Row } from "antd";
import { memo } from "react";
import { Emoji } from "@/components/atoms";
import { customEmojiMap, memeEmojiMap } from "@/static/EmojiMap";
import { EmojiIdObject, EmoteEmojis } from "@/@types";
import { css } from "ss/css";

type Props = {
    emojis: EmoteEmojis;
};

function DisplayEmoteEmojiComponent({ emojis }: Props) {
    // NOTE: 本来keyにindexを設定するのは望ましくないが、ここでは差し替えや入れ替えを伴わないためindexにする
    const displayEmojis = emojis.map((emoji: EmojiIdObject, index: number) => {
        return <Emoji key={index} emojiId={emoji.emojiId} size={62} />;
    });

    const isAllEmojisCustomOrMeme = emojis.every((emoji: EmojiIdObject) => {
        return (
            customEmojiMap.some((customEmoji) => customEmoji.emojiId === emoji.emojiId) ||
            memeEmojiMap.some((memeEmoji) => memeEmoji.emojiId === emoji.emojiId)
        );
    });

    const emojiRowStyle = css({
        marginTop: "4px",
        marginBottom: isAllEmojisCustomOrMeme ? "8px" : "0px",
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "62px !important"
    });

    const emojiRowStyleForAllEmojisCustomOrMeme = css({
        marginTop: "16px",
        marginBottom: "8px",
        marginLeft: "8px",
        fontSize: "62px !important"
    });

    return (
        <>
            {isAllEmojisCustomOrMeme ? (
                <Row className={emojiRowStyleForAllEmojisCustomOrMeme} align="middle">
                    {displayEmojis}
                </Row>
            ) : (
                <Row className={emojiRowStyle} align="middle">
                    {displayEmojis}
                </Row>
            )}
        </>
    );
}

export const DisplayEmoteEmoji = memo(DisplayEmoteEmojiComponent);
