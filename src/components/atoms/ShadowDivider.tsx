import { useIsMobile } from "@/hooks";
import { Divider } from "antd";
import { css } from "ss/css";

export const ShadowDivider = () => {
    const isMobile = useIsMobile();

    const shadowDividerStyle = css({
        boxShadow: "0 0 0 2px #e0e0e0",
        margin: isMobile ? "12px 0 !important" : "24px 0 !important"
    });

    return <Divider className={shadowDividerStyle} />;
};
