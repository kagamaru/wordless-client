import { DisplayEmoteEmojiArray } from "@/@types/DisplayEmoteEmojiArray";
import { EmojiString } from "@/@types/emojiString";
import { Row } from "antd";
import * as emoji from "node-emoji";
import { css } from "ss/css";

type Props = {
    emojiIds: DisplayEmoteEmojiArray;
};

export function DisplayEmoteEmoji(props: Props) {
    const emojiRow = css({
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "48px !important"
    });

    // NOTE: 本来keyにindexを設定するのは望ましくないが、ここでは差し替えや入れ替えを伴わないためindexにする
    const displayEmojis = props.emojiIds.map((emojiId: EmojiString, index: number) => (
        <div key={index}>{emoji.get(emojiId)}</div>
    ));

    return (
        <>
            <Row className={emojiRow}>{displayEmojis}</Row>
        </>
    );
}
