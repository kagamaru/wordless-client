import { Emote } from "@/class";
import { WordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
};

export function WordlessEmotes(props: Props) {
    const emotesElement = props.emotes?.map((emote) => {
        return (
            <div role="listitem" key={emote.emoteId} aria-label={emote.emoteId}>
                <WordlessEmote emote={emote}></WordlessEmote>
            </div>
        );
    });
    return <div role="list">{emotesElement}</div>;
}
