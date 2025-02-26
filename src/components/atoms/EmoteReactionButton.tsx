import { EmojiType } from "@/@types/Emoji";
import { EmoteReactionEmojiWithNumber } from "@/@types";
import { emojiHelper } from "@/helpers";
import { Button } from "antd";
import Image from "next/image";
import * as emoji from "node-emoji";
import { css } from "ss/css";

type Props = {
    emoteReactionEmojiWithNumber: EmoteReactionEmojiWithNumber;
    onClick: () => void;
};

export function EmoteReactionButton(props: Props) {
    const emojiButton = css({
        height: "24px !important",
        width: "60px",
        marginTop: "4px",
        marginLeft: "4px"
    });

    const numberOfReactionsCSS = css({
        fontSize: "12px",
        fontWeight: "bold"
    });

    const emoteReactionButton = () => {
        const returnedEmoji = emojiHelper(props.emoteReactionEmojiWithNumber.emojiId);

        if (returnedEmoji.emojiType === EmojiType.Preset) {
            return <span>{emoji.get(props.emoteReactionEmojiWithNumber.emojiId)}</span>;
        } else {
            return <Image src={returnedEmoji.url ?? ""} alt="" width={24} height={24} />;
        }
    };

    const numberOfReactionsText = (numReactions: number) => {
        if (numReactions > 99) {
            return <span className={numberOfReactionsCSS}>99+</span>;
        } else {
            return <span>{numReactions}</span>;
        }
    };

    return (
        <>
            <Button shape="round" className={emojiButton} onClick={() => props.onClick()}>
                {emoteReactionButton()}
                {numberOfReactionsText(props.emoteReactionEmojiWithNumber.numberOfReactions)}
            </Button>
        </>
    );
}
