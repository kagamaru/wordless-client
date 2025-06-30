import { Divider } from "antd";
import { css } from "ss/css";

type Props = {
    dashed: boolean;
};

export function WordlessDivider({ dashed }: Props) {
    const dividerStyle = css({
        margin: "0px !important",
        borderTop: `1px ${dashed ? "dashed" : "solid"} !important`,
        borderColor: "superLightGrey !important",
        borderWidth: "1px !important"
    });

    return (
        <>
            <Divider className={dividerStyle} />
        </>
    );
}
