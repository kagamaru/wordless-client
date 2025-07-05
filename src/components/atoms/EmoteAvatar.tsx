"use client";

import { Avatar } from "antd";
import { memo } from "react";
import { css } from "ss/css";
import { useIsMobile } from "@/hooks";

type Props = {
    userName: string;
    url: string;
};

function EmoteAvatarComponent({ userName, url }: Props) {
    const isMobile = useIsMobile();

    const avatarStyle = css({
        height: isMobile ? "32px" : "50px !important",
        width: isMobile ? "32px" : "50px !important"
    });

    return (
        <>
            <Avatar className={avatarStyle} src={url} alt={userName + "ProfileImage"}></Avatar>
        </>
    );
}

export const EmoteAvatar = memo(EmoteAvatarComponent);
