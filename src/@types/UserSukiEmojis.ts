import { EmojiString } from "@/@types/EmojiString";

export type UserSukiEmojis =
    | [EmojiString]
    | [EmojiString, EmojiString]
    | [EmojiString, EmojiString, EmojiString]
    | [EmojiString, EmojiString, EmojiString, EmojiString];
