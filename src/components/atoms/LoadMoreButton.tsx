import { SearchOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";

type Props = {
    isLoading: boolean;
    onClickAction: () => void;
};

export const LoadMoreButton = ({ isLoading, onClickAction }: Props) => {
    return (
        <>
            {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    color="primary"
                    shape="round"
                    variant="outlined"
                    icon={<SearchOutlined />}
                    onClick={onClickAction}
                    loading={isLoading}
                    size="large"
                >
                    もっと見る
                </Button>
            </ConfigProvider>
        </>
    );
};
