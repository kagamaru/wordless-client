import { EmoteReactionEmojiWithNumber } from "@/@types/EmoteReactionEmojiWithNumber";

export type OnReactIncomingMessage = {
    action: "onReact";
    emoteReactionId: string;
    emoteReactionEmojis: EmoteReactionEmojiWithNumber[];
    totalNumberOfReactions: number;
};
