import { LoadingOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form } from "antd";

type ChangeUserNameButtonProps = {
    isLoading: boolean;
};

export const ChangeUserNameButton = ({ isLoading }: ChangeUserNameButtonProps) => {
    return (
        <Form.Item>
            <ConfigProvider wave={{ disabled: true }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    icon={isLoading ? <LoadingOutlined /> : undefined}
                >
                    ユーザー名を変更する
                </Button>
            </ConfigProvider>
        </Form.Item>
    );
};
