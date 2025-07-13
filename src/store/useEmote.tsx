import { OnReactIncomingMessage } from "@/@types";
import { Emote } from "@/class";
import { create } from "zustand";

type EmoteStore = {
    emotes: Emote[];
    setEmotes: (emotes: Emote[]) => void;
    hasEmoteSet: boolean;
    addEmote: (emote: Emote) => void;
    updateEmoteReactionEmojis: (data: OnReactIncomingMessage) => void;
};

export const useEmoteStore = create<EmoteStore>((set) => ({
    emotes: [],
    setEmotes: (emotes: Emote[]) => {
        set({ emotes });
        set({ hasEmoteSet: true });
    },
    hasEmoteSet: false,
    addEmote: (emote: Emote) => set((state: EmoteStore) => ({ emotes: [...state.emotes, emote] })),
    updateEmoteReactionEmojis: (data: OnReactIncomingMessage) => {
        set((state: EmoteStore) => {
            const updatedEmotes = state.emotes.map((emote: Emote) => {
                if (emote.emoteReactionId === data.emoteReactionId) {
                    return {
                        ...emote,
                        emoteReactionEmojis: data.emoteReactionEmojis,
                        totalNumberOfReactions: data.totalNumberOfReactions
                    };
                }
                return emote;
            });
            return { emotes: updatedEmotes };
        });
    }
}));
