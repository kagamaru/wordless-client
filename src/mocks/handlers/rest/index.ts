import { emoteHandlers } from "./emote";
import { userHandlers } from "./user";
import { userSubHandlers } from "./userSub";
import { userSukiHandlers } from "./userSuki";

export const restHandlers = [...emoteHandlers, ...userHandlers, ...userSubHandlers, ...userSukiHandlers];
