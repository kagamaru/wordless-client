import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";

type Props = {
    isLoading: boolean;
    onClick: () => void;
};

export const ChangeImageButton = ({ isLoading, onClick }: Props) => {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    icon={isLoading ? <LoadingOutlined /> : <SyncOutlined />}
                    iconPosition="start"
                    onClick={onClick}
                    loading={isLoading}
                >
                    画像を変更する
                </Button>
            </ConfigProvider>
        </>
    );
};
