"use client";

import { Button, ConfigProvider } from "antd";

type Props = {
    sampleUserName: "Nozomi" | "Nico";
    onClickAction: () => void;
};

export function SampleLoginButton({ sampleUserName, onClickAction }: Props) {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" htmlType="submit" block onClick={onClickAction}>
                    サンプルログイン（{sampleUserName}）
                </Button>
            </ConfigProvider>
        </>
    );
}
