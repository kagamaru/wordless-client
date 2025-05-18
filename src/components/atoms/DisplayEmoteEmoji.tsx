import { Row } from "antd";
import { memo } from "react";
import { Emoji } from "@/components/atoms";
import { EmojiIdObject, EmoteEmojis } from "@/@types";
import { css } from "ss/css";

type Props = {
    emojis: EmoteEmojis;
};

function DisplayEmoteEmojiComponent({ emojis }: Props) {
    const emojiRow = css({
        marginTop: "8px",
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "62px !important"
    });

    // NOTE: 本来keyにindexを設定するのは望ましくないが、ここでは差し替えや入れ替えを伴わないためindexにする
    const displayEmojis = emojis.map((emoji: EmojiIdObject, index: number) => {
        return <Emoji key={index} emojiId={emoji.emojiId} size={62} />;
    });

    return (
        <>
            <Row className={emojiRow} align="middle">
                {displayEmojis}
            </Row>
        </>
    );
}

export const DisplayEmoteEmoji = memo(DisplayEmoteEmojiComponent);
