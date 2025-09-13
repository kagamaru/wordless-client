"use client";

import { Button, ConfigProvider } from "antd";

type Props = {
    isLoading: boolean;
};

export function ChangePasswordButton({ isLoading }: Props) {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" color="primary" type="primary" htmlType="submit" block loading={isLoading}>
                    パスワード変更
                </Button>
            </ConfigProvider>
        </>
    );
}
