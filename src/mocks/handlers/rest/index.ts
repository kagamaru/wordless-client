import { emoteHandlers } from "./emote";
import { followerHandlers } from "./follower";
import { userImageHandlers } from "./userImage";
import { userHandlers } from "./user";
import { userSubHandlers } from "./userSub";
import { userSukiHandlers } from "./userSuki";

export const restHandlers = [
    ...emoteHandlers,
    ...followerHandlers,
    ...userImageHandlers,
    ...userHandlers,
    ...userSubHandlers,
    ...userSukiHandlers
];
