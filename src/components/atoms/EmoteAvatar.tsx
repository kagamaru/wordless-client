"use client";

import { Avatar } from "antd";
import { memo } from "react";
import { css } from "ss/css";

type Props = {
    userName: string;
    url: string;
};

export const EmoteAvatar = memo(function EmoteAvatar(props: Props) {
    const avatar = css({
        height: { base: "32px", lg: "50px !important" },
        width: { base: "32px", lg: "50px !important" }
    });

    return (
        <>
            <Avatar className={avatar} src={props.url} alt={props.userName + "ProfileImage"}></Avatar>
        </>
    );
});
