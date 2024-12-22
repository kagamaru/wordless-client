import { EmojiString } from "./emojiString";

export type DisplayEmoteEmojiArray =
    | [EmojiString]
    | [EmojiString, EmojiString]
    | [EmojiString, EmojiString, EmojiString]
    | [EmojiString, EmojiString, EmojiString, EmojiString];
