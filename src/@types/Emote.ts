import { EmoteEmojis } from "@/@types/EmoteEmojis";

export type Emote = {
    emoteId: string;
    userName: string;
    userId: string;
    emoteDatetime: string;
    emoteReactionId: string;
    emoteEmojis: EmoteEmojis;
    userAvatarUrl: string;
};
