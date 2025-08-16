import { Divider } from "antd";
import { css } from "ss/css";

export const CardDivider = () => {
    const cardDividerStyle = css({
        margin: "12px 0 16px"
    });

    return <Divider className={cardDividerStyle} />;
};
