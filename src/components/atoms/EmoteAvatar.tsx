"use client";

import { Avatar } from "antd";
import { memo } from "react";
import { css } from "ss/css";

type Props = {
    userName: string;
    url: string;
};

function EmoteAvatarComponent({ userName, url }: Props) {
    const avatarStyle = css({
        height: { base: "32px", lg: "50px !important" },
        width: { base: "32px", lg: "50px !important" }
    });

    return (
        <>
            <Avatar className={avatarStyle} src={url} alt={userName + "ProfileImage"}></Avatar>
        </>
    );
}

export const EmoteAvatar = memo(EmoteAvatarComponent);
