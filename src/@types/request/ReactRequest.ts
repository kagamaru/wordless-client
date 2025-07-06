import { EmojiString } from "@/@types";

export type ReactRequest = {
    emoteReactionId: string;
    reactedEmojiId: EmojiString;
    reactedUserId: string;
    operation: "increment" | "decrement";
    Authorization: string;
};
