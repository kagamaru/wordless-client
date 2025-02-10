import { Emote, EmoteGetAllResponse, EmoteReactionGetResponse } from "@/@types";
import { WordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
};

export function WordlessEmotes(props: Props) {
    const emotesElement = props.emotes.map((emote) => {
        return (
            <>
                <WordlessEmote emote={emote} emoteReaction={emote.emoteReactionEmojis}></WordlessEmote>
            </>
        );
    });

    return emotesElement;
}
