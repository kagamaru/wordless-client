import { Emote } from "@/class";
import { WordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
};

export function WordlessEmotes({ emotes }: Props) {
    const emotesElement = emotes?.map((emote) => {
        return (
            <div role="listitem" key={emote.emoteId} aria-label={emote.emoteId}>
                <WordlessEmote emote={emote}></WordlessEmote>
            </div>
        );
    });
    return (
        <div role="list" aria-label="エモート一覧">
            {emotesElement}
        </div>
    );
}
