import { EmojiIdObject } from "@/@types/EmojiIdObject";

export type EmoteEmojis =
    | [EmojiIdObject]
    | [EmojiIdObject, EmojiIdObject]
    | [EmojiIdObject, EmojiIdObject, EmojiIdObject]
    | [EmojiIdObject, EmojiIdObject, EmojiIdObject, EmojiIdObject];
