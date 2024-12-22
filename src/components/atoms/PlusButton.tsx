import { Button } from "antd";
import { css } from "ss/css";

type Props = {
    onClick: () => void;
};

export function PlusButton(props: Props) {
    const button = css({
        height: "24px !important",
        width: "20px",
        marginTop: "4px"
    });

    return (
        <>
            <Button shape="round" className={button} onClick={() => props.onClick()}>
                +
            </Button>
        </>
    );
}
