import { Emoji, EmojiCategory, EmojiType } from "@/@types/Emoji";

const s3Url = process.env.NEXT_PUBLIC_S3_URL + "/custom/";

if (!s3Url) {
    throw new Error("NEXT_PUBLIC_S3_URL is not set");
}

export const customEmojis: Array<Emoji> = [
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":hello:",
        emojiJapaneseId: "こんにちは"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":good_evening:",
        emojiJapaneseId: "こんばんは"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":thank_you:",
        emojiJapaneseId: "ありがとう"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":sorry:",
        emojiJapaneseId: "ごめんなさい"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":you_are_welcome:",
        emojiJapaneseId: "どういたしまして"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":congratulations:",
        emojiJapaneseId: "おめでとう"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":homework:",
        emojiJapaneseId: "宿題"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":job:",
        emojiJapaneseId: "仕事"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":school_custom:",
        emojiJapaneseId: "学校"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":test:",
        emojiJapaneseId: "テスト"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":one_chance:",
        emojiJapaneseId: "ワンチャン"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":maji_manji:",
        emojiJapaneseId: "まじ卍"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":last:",
        emojiJapaneseId: "ラスト"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":happyhappyhappy:",
        emojiJapaneseId: "ハッピーハッピーハッピー"
    }
];
