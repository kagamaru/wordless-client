"use client";

import { Button } from "antd";
import { css } from "ss/css";

type Props = {
    onClickAction: () => void;
};

export function PlusButton({ onClickAction }: Props) {
    const button = css({
        height: "32px",
        width: "24px",
        marginTop: "4px"
    });

    return (
        <>
            <Button shape="round" className={button} onClick={onClickAction}>
                +
            </Button>
        </>
    );
}
