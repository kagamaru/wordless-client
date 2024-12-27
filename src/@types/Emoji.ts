import { EmojiString } from "@/@types/EmojiString";

export type Emoji = {
    emojiType: EmojiType;
    emojiId: EmojiString;
    emojiJapaneseId: string;
    url?: string;
};

export enum EmojiType {
    "Preset" = 1,
    "Custom" = 2,
    "Meme" = 3
}
