import { EmojiString } from "@/@types/emojiString";
import { Button } from "antd";
import * as emoji from "node-emoji";
import { css } from "ss/css";

type Props = {
    emojiId: EmojiString;
    numberOfReactions: number;
    onClick: () => void;
};

export function EmoteEmojiButton(props: Props) {
    const emojiButton = css({
        height: "24px !important",
        width: "60px",
        marginTop: "4px",
        marginLeft: "4px"
    });

    return (
        <>
            <Button shape="round" className={emojiButton} onClick={() => props.onClick()}>
                <span>{emoji.get(props.emojiId)}</span>
                <span>{props.numberOfReactions}</span>
            </Button>
        </>
    );
}
