import { Emote } from "@/class";

export type OnPostEmoteIncomingMessage = {
    action: "onPostEmote";
    emote: Emote;
};
