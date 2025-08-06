import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { css } from "ss/css";

type Props = {
    ariaLabel: string;
    onClickAction: () => void;
};

export const EditButton = ({ ariaLabel, onClickAction }: Props) => {
    const editButtonStyle = css({
        borderColor: "primary !important",
        color: "primary !important"
    });

    return (
        <Button
            variant="outlined"
            shape="circle"
            icon={<EditOutlined />}
            className={editButtonStyle}
            aria-label={ariaLabel}
            onClick={onClickAction}
        />
    );
};
