import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { css } from "ss/css";

type Props = {
    onClickAction: () => void;
};

export const SyncButton = ({ onClickAction }: Props) => {
    const syncButtonStyle = css({
        borderColor: "primary !important",
        color: "primary !important"
    });

    return (
        <Button
            shape="circle"
            size="small"
            icon={<SyncOutlined />}
            className={syncButtonStyle}
            aria-label="ユーザー画像変更ボタン"
            onClick={onClickAction}
        />
    );
};
