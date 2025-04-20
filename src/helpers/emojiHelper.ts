import { Emoji, EmojiCategory, EmojiType } from "@/@types/Emoji";
import { EmojiString } from "@/@types/EmojiString";
import { emojiMap } from "@/static/EmojiMap";

// NOTE: Emoji型を返したいため、undefinedの時は虫を返すようにして握りつぶす。
// NOTE: 渡されるIDは全てjson内に存在するため、実際に使用した際はバグでない限りbugが帰ることはない。
export function emojiHelper(emojiId: EmojiString): Emoji {
    return (
        emojiMap.find((emoji) => emoji.emojiId === emojiId) ?? {
            emojiCategory: EmojiCategory.Preset,
            emojiType: EmojiType.AnimalsNature,
            emojiId: ":bug:",
            emojiJapaneseId: "虫、動物、昆虫"
        }
    );
}
