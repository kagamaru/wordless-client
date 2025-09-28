import Image from "next/image";
import { memo } from "react";
import { EmojiString } from "@/@types";
import { EmojiCategory } from "@/@types/Emoji";
import { emojiHelper } from "@/helpers";
import { css } from "ss/css";

type Props = {
    emojiId: EmojiString;
    size: number;
};

const EmojiComponent = ({ emojiId, size }: Props) => {
    const returnedEmoji = emojiId ? emojiHelper(emojiId) : undefined;
    if (!returnedEmoji) return null;

    const presetEmojiStyle = css({
        fontSize: `${size.toString()}px !important`
    });

    if (returnedEmoji.emojiCategory === EmojiCategory.Preset) {
        return (
            <div className={presetEmojiStyle} aria-label={returnedEmoji.emojiId} title={returnedEmoji.emojiJapaneseId}>
                {returnedEmoji.emojiChar}
            </div>
        );
    } else {
        const imageAlt = returnedEmoji.emojiJapaneseId || "No image available";

        return (
            <Image
                src={returnedEmoji.url ?? ""}
                aria-label={returnedEmoji.emojiId}
                title={returnedEmoji.emojiJapaneseId}
                alt={imageAlt}
                width={size}
                height={size}
                unoptimized={returnedEmoji.url?.includes(".gif") ?? false}
            />
        );
    }
};

export const Emoji = memo(EmojiComponent);
