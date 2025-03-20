import { Button, ConfigProvider } from "antd";

export function LoginButton() {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" color="primary" type="primary" htmlType="submit" block>
                    ログイン
                </Button>
            </ConfigProvider>
        </>
    );
}
