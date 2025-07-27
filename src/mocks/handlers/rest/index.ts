import { emoteHandlers } from "./emote";
import { followerHandlers } from "./follower";
import { userHandlers } from "./user";
import { userSubHandlers } from "./userSub";
import { userSukiHandlers } from "./userSuki";

export const restHandlers = [
    ...emoteHandlers,
    ...followerHandlers,
    ...userHandlers,
    ...userSubHandlers,
    ...userSukiHandlers
];
