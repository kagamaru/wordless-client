"use client";

import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfReactions: number;
    onClickAction: () => void;
};

export function TotalNumberOfReactionsButton({ totalNumberOfReactions, onClickAction }: Props) {
    const totalNumberOfReactionsButton = css({
        padding: "0px !important"
    });

    const totalNumberOfReactionsButtonText = css({
        color: "grey"
    });

    return (
        <Button type="text" className={totalNumberOfReactionsButton} onClick={onClickAction}>
            <Row className={totalNumberOfReactionsButtonText}>
                <div>{totalNumberOfReactions}</div>
                <div className="ml-1">Reactions</div>
            </Row>
        </Button>
    );
}
