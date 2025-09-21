import { LoadingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";

type Props = {
    label: string;
    loading?: boolean;
    onClick?: () => void;
};

export function BaseButton({ label, loading = false, onClick }: Props) {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    className="mt-4"
                    color="primary"
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    onClick={onClick}
                    icon={loading ? <LoadingOutlined /> : undefined}
                >
                    {label}
                </Button>
            </ConfigProvider>
        </>
    );
}
