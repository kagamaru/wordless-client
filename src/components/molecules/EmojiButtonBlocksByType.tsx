import { Emoji, EmojiString } from "@/@types";
import { Typography } from "antd";
import { EmojiButtonRow } from "@/components/atoms";
const { Text } = Typography;

type Props = {
    typeName: string;
    emojis: Array<Emoji>;
    onClick: (emojiId: EmojiString) => void;
};

export function EmojiButtonBlocksByType({ typeName, emojis, onClick }: Props) {
    return (
        <div className={"mt-2"}>
            <Typography className={"mb-2"}>
                <Text strong>{typeName}</Text>
            </Typography>
            <EmojiButtonRow emojis={emojis} onClick={onClick} />
        </div>
    );
}
