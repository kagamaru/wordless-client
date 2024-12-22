import { Divider } from "antd";
import { css } from "ss/css";

export function WordlessDivider() {
    const divider = css({
        margin: "0px !important",
        borderTop: "1px solid !important",
        borderColor: "lightGrey !important"
    });

    return (
        <>
            <Divider className={divider} />
        </>
    );
}
