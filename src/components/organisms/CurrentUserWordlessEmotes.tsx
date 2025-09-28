import { Emote } from "@/class";
import { CurrentUserWordlessEmote } from "@/components/molecules";

type Props = {
    emotes: Array<Emote>;
    isDeletingEmote: boolean;
    onEmoteDeleteAction: (emoteId: string) => Promise<void>;
    onReactionClickAction?: () => Promise<void>;
};

export function CurrentUserWordlessEmotes({
    emotes,
    isDeletingEmote,
    onReactionClickAction,
    onEmoteDeleteAction
}: Props) {
    const emotesElement = emotes?.map((emote) => {
        return (
            <div role="listitem" key={emote.emoteId} aria-label={emote.emoteId}>
                <CurrentUserWordlessEmote
                    emote={emote}
                    isDeletingEmote={isDeletingEmote}
                    onReactionClickAction={onReactionClickAction}
                    onEmoteDeleteAction={onEmoteDeleteAction}
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
