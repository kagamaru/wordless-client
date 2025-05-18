export type ReactRequest = {
    action: "onReact";
    emoteReactionId: string;
    reactedEmojiId: `:${string}:`;
    reactedUserId: string;
    operation: "increment" | "decrement";
};
