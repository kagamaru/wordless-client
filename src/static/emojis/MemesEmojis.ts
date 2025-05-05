import { Emoji } from "@/@types";
import { EmojiCategory, EmojiType } from "@/@types/Emoji";

const s3Url = process.env.NEXT_PUBLIC_S3_URL + "/meme/";

if (!s3Url) {
    throw new Error("NEXT_PUBLIC_S3_URL is not set");
}

export const memeEmojis: Array<Emoji> = [
    {
        emojiCategory: EmojiCategory.Meme,
        emojiType: EmojiType.Memes,
        emojiId: ":neko_meme_scream_baby_cat:",
        emojiJapaneseId: "猫ミーム_叫ぶ猫"
    },
    {
        emojiCategory: EmojiCategory.Meme,
        emojiType: EmojiType.Memes,
        emojiId: ":neko_meme_surprising_cat:",
        emojiJapaneseId: "猫ミーム_驚く猫"
    }
];
