"use client";

import { Button, ConfigProvider } from "antd";

export function ChangePasswordButton() {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" color="primary" type="primary" htmlType="submit" block>
                    パスワード変更
                </Button>
            </ConfigProvider>
        </>
    );
}
