"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { css } from "ss/css";

type Props = {
    onClickAction: () => void;
};

export function CloseButton({ onClickAction }: Props) {
    const closeButtonStyle = css({
        display: "flex",
        justifyContent: "flex-end"
    });

    return (
        <div className={closeButtonStyle}>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button icon={<CloseOutlined />} onClick={onClickAction} />
            </ConfigProvider>
        </div>
    );
}
