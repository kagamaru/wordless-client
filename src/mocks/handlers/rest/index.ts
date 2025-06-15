import { emoteHandlers } from "./emote";
import { userHandlers } from "./user";

export const restHandlers = [...emoteHandlers, ...userHandlers];
