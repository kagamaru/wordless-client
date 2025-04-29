import { CloseOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { css } from "ss/css";

type Props = {
    onClick: () => void;
};

export function CloseButton({ onClick }: Props) {
    const closeButton = css({
        display: "flex",
        justifyContent: "flex-end"
    });

    return (
        <div className={closeButton}>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button icon={<CloseOutlined />} onClick={onClick} />
            </ConfigProvider>
        </div>
    );
}
