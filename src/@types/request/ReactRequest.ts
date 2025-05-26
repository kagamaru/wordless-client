export type ReactRequest = {
    emoteReactionId: string;
    reactedEmojiId: `:${string}:`;
    reactedUserId: string;
    operation: "increment" | "decrement";
    Authorization: string;
};
