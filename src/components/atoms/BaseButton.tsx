import { Button, ConfigProvider } from "antd";

type Props = {
    label: string;
    loading?: boolean;
};

export function BaseButton({ label, loading = false }: Props) {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button className="mt-4" color="primary" type="primary" htmlType="submit" block loading={loading}>
                    {label}
                </Button>
            </ConfigProvider>
        </>
    );
}
