"use client";

import { Emoji, EmojiString } from "@/@types";
import { Typography } from "antd";
import { EmojiButtonRow } from "@/components/atoms";
const { Text } = Typography;

type Props = {
    typeName: string;
    emojis: Array<Emoji>;
    onClickAction: (emojiId: EmojiString) => void;
};

export function EmojiButtonBlocksByType({ typeName, emojis, onClickAction }: Props) {
    return (
        <div className={"mt-2"}>
            <Typography className={"mb-2"}>
                <Text strong>{typeName}</Text>
            </Typography>
            <EmojiButtonRow emojis={emojis} onClickAction={onClickAction} />
        </div>
    );
}
