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

    const emoteReactionButton = () => {
        const returnedEmoji = emojiHelper(props.emoteReactionEmojiWithNumber.emojiId);

        if (returnedEmoji.emojiType === EmojiType.Preset) {
            return <span>{emoji.get(props.emoteReactionEmojiWithNumber.emojiId)}</span>;
        } else {
            return <Image src={returnedEmoji.url ?? ""} alt="" width={24} height={24} />;
        }
    };

    return (
        <>
            <Button shape="round" className={emojiButton} onClick={() => props.onClick()}>
                {emoteReactionButton()}
                <span>{props.emoteReactionEmojiWithNumber.numberOfReactions}</span>
            </Button>
        </>
    );
}
