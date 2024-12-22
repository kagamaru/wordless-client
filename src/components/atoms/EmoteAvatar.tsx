import { Avatar } from "antd";
import { css } from "ss/css";

export function EmoteAvatar() {
    const avatar = css({
        height: { base: "32px", lg: "50px !important" },
        width: { base: "32px", lg: "50px !important" }
    });

    return (
        <>
            <Avatar className={avatar} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
        </>
    );
}
