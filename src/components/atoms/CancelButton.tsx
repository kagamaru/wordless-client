import { Button } from "antd";
import { css } from "ss/css";

type Props = {
    onClickAction: () => void;
};

export const CancelButton = ({ onClickAction }: Props) => {
    const cancelButtonStyle = css({
        marginRight: "8px",
        color: "#1677FF !important"
    });

    return (
        <Button className={cancelButtonStyle} type="text" onClick={onClickAction}>
            キャンセル
        </Button>
    );
};
