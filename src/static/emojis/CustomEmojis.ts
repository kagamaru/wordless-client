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
        emojiJapaneseId: "こんにちは",
        url: s3Url + "hello.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":good_evening:",
        emojiJapaneseId: "こんばんは",
        url: s3Url + "good_evening.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":thank_you:",
        emojiJapaneseId: "ありがとう",
        url: s3Url + "thank_you.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":sorry:",
        emojiJapaneseId: "ごめんなさい",
        url: s3Url + "sorry.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":you_are_welcome:",
        emojiJapaneseId: "どういたしまして",
        url: s3Url + "you_are_welcome.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":congratulations:",
        emojiJapaneseId: "おめでとう",
        url: s3Url + "congratulations.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":homework:",
        emojiJapaneseId: "宿題",
        url: s3Url + "homework.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":job:",
        emojiJapaneseId: "仕事",
        url: s3Url + "job.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":school_custom:",
        emojiJapaneseId: "学校",
        url: s3Url + "school.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":test:",
        emojiJapaneseId: "テスト",
        url: s3Url + "test.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":one_chance:",
        emojiJapaneseId: "ワンチャン",
        url: s3Url + "one_chance.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":maji_manji:",
        emojiJapaneseId: "まじ卍",
        url: s3Url + "maji_manji.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":last:",
        emojiJapaneseId: "ラスト",
        url: s3Url + "last.png"
    },
    {
        emojiCategory: EmojiCategory.Custom,
        emojiType: EmojiType.Custom,
        emojiId: ":happyhappyhappy:",
        emojiJapaneseId: "ハッピーハッピーハッピー",
        url: s3Url + "happyhappyhappy.png"
    }
];
