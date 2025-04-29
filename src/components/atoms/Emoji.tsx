import * as emojiManipulator from "node-emoji";
import Image from "next/image";
import { EmojiString } from "@/@types";
import { EmojiCategory } from "@/@types/Emoji";
import { emojiHelper } from "@/helpers";

type Props = {
    emojiId: EmojiString;
    size: number;
};

export function Emoji({ emojiId, size }: Props) {
    const returnedEmoji = emojiHelper(emojiId);

    if (returnedEmoji.emojiCategory === EmojiCategory.Preset) {
        return <div aria-label={returnedEmoji.emojiId}>{emojiManipulator.get(returnedEmoji.emojiId)}</div>;
    } else {
        return <Image src={returnedEmoji.url ?? ""} alt={returnedEmoji.emojiJapaneseId} width={size} height={size} />;
    }
}
