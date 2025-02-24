import { EmoteEmojis, EmoteReactionEmojiWithNumber } from "@/@types";

export class FetchEmotesResponse {
    public emotes: Array<Emote> = [];

    constructor(arrayArgs: Array<Emote>) {
        arrayArgs.map((element) => {
            this.emotes.push(new Emote(element));
        });
    }
}

export class Emote {
    public readonly sequenceNumber: number;
    public readonly emoteId: string;
    public readonly userName: string;
    public readonly userId: string;
    public readonly emoteDatetime: string;
    public readonly emoteReactionId: string;
    public readonly emoteEmojis: EmoteEmojis;
    public readonly userAvatarUrl: string;
    public readonly emoteReactionEmojis: Array<EmoteReactionEmojiWithNumber>;

    constructor(args: {
        sequenceNumber: number;
        emoteId: string;
        userName: string;
        userId: string;
        emoteDatetime: string;
        emoteReactionId: string;
        emoteEmojis: EmoteEmojis;
        userAvatarUrl: string;
        emoteReactionEmojis: Array<EmoteReactionEmojiWithNumber>;
    }) {
        this.sequenceNumber = args.sequenceNumber;
        this.emoteId = args.emoteId;
        this.userName = args.userName;
        this.userId = args.userId;
        this.emoteDatetime = args.emoteDatetime;
        this.emoteReactionId = args.emoteReactionId;
        this.emoteEmojis = args.emoteEmojis;
        this.userAvatarUrl = args.userAvatarUrl;
        this.emoteReactionEmojis = args.emoteReactionEmojis;
    }
}
