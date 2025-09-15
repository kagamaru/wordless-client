import { SendOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";

type Props = {
    isProcessing: boolean;
};

export function SendEmailButton({ isProcessing }: Props) {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    htmlType="submit"
                    type="primary"
                    icon={<SendOutlined />}
                    disabled={isProcessing}
                    loading={isProcessing}
                >
                    メール送信
                </Button>
            </ConfigProvider>
        </>
    );
}
