"use client";

import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfReactions: number;
    onClick: () => void;
};

export function TotalNumberOfReactionsButton(props: Props) {
    const totalNumberOfReactionsButton = css({
        padding: "0px !important"
    });

    const totalNumberOfReactionsButtonText = css({
        color: "grey"
    });

    return (
        <Button type="text" className={totalNumberOfReactionsButton} onClick={props.onClick}>
            <Row className={totalNumberOfReactionsButtonText}>
                <div>{props.totalNumberOfReactions}</div>
                <div className="ml-1">Reactions</div>
            </Row>
        </Button>
    );
}
