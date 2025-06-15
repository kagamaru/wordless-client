import { emoteHandlers } from "./emote";
import { userHandlers } from "./user";
import { userSubHandlers } from "./userSub";

export const restHandlers = [...emoteHandlers, ...userHandlers, ...userSubHandlers];
