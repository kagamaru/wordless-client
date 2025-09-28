import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { useRef } from "react";

type Props = {
    isLoading: boolean;
    onClick: (file: File) => void;
};

export const ChangeImageButton = ({ isLoading, onClick }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click(); // ボタン押下時に input をクリック
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onClick(file);
        }
    };

    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    icon={isLoading ? <LoadingOutlined /> : <SyncOutlined />}
                    iconPosition="start"
                    onClick={handleButtonClick}
                    loading={isLoading}
                >
                    画像を変更する
                </Button>
                <input
                    data-testid="file-input-change-image-button"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </ConfigProvider>
        </>
    );
};
