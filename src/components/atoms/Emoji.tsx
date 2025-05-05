import Image from "next/image";
import { EmojiString } from "@/@types";
import { EmojiCategory } from "@/@types/Emoji";
import { emojiHelper } from "@/helpers";
import { css } from "ss/css";

type Props = {
    emojiId: EmojiString;
    size: number;
};

export function Emoji({ emojiId, size }: Props) {
    const returnedEmoji = emojiHelper(emojiId);
    const presetEmoji = css({
        fontSize: `${size.toString()}px !important`
    });

    if (returnedEmoji.emojiCategory === EmojiCategory.Preset) {
        return (
            <div className={presetEmoji} aria-label={returnedEmoji.emojiId} title={returnedEmoji.emojiJapaneseId}>
                {returnedEmoji.emojiChar}
            </div>
        );
    } else {
        const imageAlt = returnedEmoji.emojiJapaneseId || "No image available";

        return (
            <Image
                src={returnedEmoji.url ?? ""}
                title={returnedEmoji.emojiJapaneseId}
                alt={imageAlt}
                width={size}
                height={size}
            />
        );
    }
}
