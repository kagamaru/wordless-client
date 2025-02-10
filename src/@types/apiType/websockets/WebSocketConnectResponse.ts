import { EmoteEmojis } from "@/@types/EmoteEmojis";
import { EmoteReactionEmojiWithNumber } from "@/@types/EmoteReactionEmojiWithNumber";

export type WebSocketConnectResponse = {
    emotes: Array<Emote>;
    readonly connectionId: string;
};

export type Emote = {
    readonly sequenceNumber: number;
    readonly emoteId: string;
    readonly userName: string;
    readonly userId: string;
    readonly emoteDatetime: string;
    readonly emoteReactionId: string;
    readonly emoteEmojis: EmoteEmojis;
    readonly userAvatarUrl: string;
    emoteReactionEmojis: Array<EmoteReactionEmojiWithNumber>;
};
