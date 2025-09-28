import { Emote } from "@/class";
import { WordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
    onReactionClickAction?: () => Promise<void>;
};

export function WordlessEmotes({ emotes, onReactionClickAction }: Props) {
    const emotesElement = emotes?.map((emote) => {
        return (
            <div role="listitem" key={emote.emoteId} aria-label={emote.emoteId}>
                <WordlessEmote emote={emote} onReactionClickAction={onReactionClickAction}></WordlessEmote>
            </div>
        );
    });
    return (
        <div role="list" aria-label="エモート一覧">
            {emotesElement}
        </div>
    );
}
