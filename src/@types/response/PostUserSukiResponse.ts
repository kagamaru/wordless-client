import { UserSukiEmojis } from "@/@types";

export type PostUserSukiResponse = {
    userId: string;
    userSuki: UserSukiEmojis | [];
};
