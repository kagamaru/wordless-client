import { EmoteReactionEmojiWithNumber } from "@/@types";
import { Button } from "antd";
import { css } from "ss/css";
import { Emoji } from "./Emoji";

type Props = {
    emoteReactionEmojiWithNumber: EmoteReactionEmojiWithNumber;
    emoteReactionId: string;
    onClick: () => void;
    isReacted: boolean;
};

export function EmoteReactionButton(props: Props) {
    const emojiButton = css({
        height: "32pxt",
        width: "72px",
        marginTop: "4px",
        marginLeft: "4px",
        borderColor: props.isReacted ? "primary !important" : "",
        backgroundColor: props.isReacted ? "lightPurple !important" : ""
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
                aria-label={props.emoteReactionId + props.emoteReactionEmojiWithNumber.emojiId}
                shape="round"
                className={emojiButton}
                onClick={props.onClick}
                aria-pressed={props.isReacted}
            >
                <Emoji emojiId={props.emoteReactionEmojiWithNumber.emojiId} size={24} />
                {numberOfReactionsText(props.emoteReactionEmojiWithNumber.numberOfReactions)}
            </Button>
        </>
    );
}
