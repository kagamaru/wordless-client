import { EditOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
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
        // NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する
        <ConfigProvider wave={{ disabled: true }}>
            <Button
                variant="outlined"
                shape="circle"
                icon={<EditOutlined />}
                className={editButtonStyle}
                aria-label={ariaLabel}
                onClick={onClickAction}
            />
        </ConfigProvider>
    );
};
