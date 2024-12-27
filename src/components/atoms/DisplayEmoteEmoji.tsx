import { EmojiIdObject, EmoteEmojis } from "@/@types";
import { EmojiType } from "@/@types/Emoji";
import { Row } from "antd";
import Image from "next/image";
import * as emojiManipulator from "node-emoji";
import { css } from "ss/css";
import { emojiHelper } from "@/helpers";

type Props = {
    emojis: EmoteEmojis;
};

export function DisplayEmoteEmoji(props: Props) {
    const emojiRow = css({
        marginLeft: { base: "8px", lg: "0px" },
        fontSize: "48px !important"
    });

    const imageEmoji = css({
        height: "62px !important",
        width: "62px !important"
    });

    // NOTE: 本来keyにindexを設定するのは望ましくないが、ここでは差し替えや入れ替えを伴わないためindexにする
    const displayEmojis = props.emojis.map((emoji: EmojiIdObject, index: number) => {
        const returnedEmoji = emojiHelper(emoji.emojiId);

        if (returnedEmoji.emojiType === EmojiType.Preset) {
            return <div key={index}>{emojiManipulator.get(emoji.emojiId)}</div>;
        } else {
            return (
                <Image
                    key={index}
                    src={returnedEmoji.url ?? ""}
                    alt={returnedEmoji.emojiJapaneseId}
                    width={62}
                    height={62}
                    className={imageEmoji}
                />
            );
        }
    });

    return (
        <>
            <Row className={emojiRow} align="middle">
                {displayEmojis}
            </Row>
        </>
    );
}
