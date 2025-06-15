"use client";

import { Button, ConfigProvider } from "antd";

export function SignupButton() {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" color="primary" type="primary" htmlType="submit" block>
                    ユーザー登録
                </Button>
            </ConfigProvider>
        </>
    );
}
