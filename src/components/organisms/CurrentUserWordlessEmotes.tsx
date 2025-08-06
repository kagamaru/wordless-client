import { Emote } from "@/class";
import { CurrentUserWordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
    onReactionClickAction?: () => Promise<void>;
};

export function CurrentUserWordlessEmotes({ emotes, onReactionClickAction }: Props) {
    const emotesElement = emotes?.map((emote) => {
        return (
            <div role="listitem" key={emote.emoteId} aria-label={emote.emoteId}>
                <CurrentUserWordlessEmote
                    emote={emote}
                    onReactionClickAction={onReactionClickAction}
                ></CurrentUserWordlessEmote>
            </div>
        );
    });
    return (
        <div role="list" aria-label="エモート一覧">
            {emotesElement}
        </div>
    );
}
