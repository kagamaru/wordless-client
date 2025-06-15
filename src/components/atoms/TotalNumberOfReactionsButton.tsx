"use client";

import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfReactions: number;
    onClickAction: () => void;
};

export function TotalNumberOfReactionsButton({ totalNumberOfReactions, onClickAction }: Props) {
    const totalNumberOfReactionsButtonStyle = css({
        padding: "0px !important"
    });

    const totalNumberOfReactionsButtonTextStyle = css({
        color: "grey"
    });

    return (
        <Button type="text" className={totalNumberOfReactionsButtonStyle} onClick={onClickAction}>
            <Row className={totalNumberOfReactionsButtonTextStyle}>
                <div>{totalNumberOfReactions}</div>
                <div className="ml-1">Reactions</div>
            </Row>
        </Button>
    );
}
