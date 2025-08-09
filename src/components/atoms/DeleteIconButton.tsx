import { DeleteOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { css } from "ss/css";

type Props = {
    size?: "small" | "middle" | "large";
    onClickAction: () => void;
};

export const DeleteIconButton = ({ size = "middle", onClickAction }: Props) => {
    const deleteButtonStyle = css({
        borderColor: "red !important",
        color: "red !important"
    });

    return (
        <ConfigProvider wave={{ disabled: true }}>
            <Button
                shape="circle"
                icon={<DeleteOutlined />}
                className={deleteButtonStyle}
                size={size}
                onClick={onClickAction}
                aria-label="エモート削除ボタン"
            />
        </ConfigProvider>
    );
};
