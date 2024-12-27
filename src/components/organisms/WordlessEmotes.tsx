import { EmoteGetAllResponse, EmoteReactionGetResponse } from "@/@types";
import { WordlessEmote } from "@/components/molecules";

type Props = {
    emotes: EmoteGetAllResponse;
    emoteReactions: EmoteReactionGetResponse;
};

export function WordlessEmotes(props: Props) {
    const emotesElement = props.emotes.map((emote) => {
        const matchedEmoteReactions = props.emoteReactions.find(
            (emoteReaction) => emoteReaction.emoteReactionId === emote.emoteReactionId
        ) ?? {
            emoteReactionId: "",
            emoteReactionEmojis: []
        };

        return (
            <>
                <WordlessEmote emote={emote} emoteReaction={matchedEmoteReactions}></WordlessEmote>
            </>
        );
    });

    return emotesElement;
}
