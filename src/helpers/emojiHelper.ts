import { Emoji, EmojiCategory, EmojiType } from "@/@types/Emoji";
import { EmojiString } from "@/@types/EmojiString";
import { customEmojiMap, memeEmojiMap, presetEmojiMap } from "@/static/EmojiMap";

const allEmojiMaps = [presetEmojiMap, customEmojiMap, memeEmojiMap];

export function emojiHelper(emojiId: EmojiString): Emoji | undefined {
    for (const emojiMap of allEmojiMaps) {
        const foundEmoji = emojiMap.find((emoji: Emoji) => emoji.emojiId === emojiId);
        if (foundEmoji) {
            return foundEmoji;
        }
    }

    return undefined;
}
