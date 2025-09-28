import { EmojiString } from "@/@types/EmojiString";

export type UserSukiEmojis =
    | [undefined, undefined, undefined, undefined]
    | [EmojiString, undefined, undefined, undefined]
    | [EmojiString, EmojiString, undefined, undefined]
    | [EmojiString, EmojiString, EmojiString, undefined]
    | [EmojiString, EmojiString, EmojiString, EmojiString];
