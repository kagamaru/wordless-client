import { Button, ConfigProvider, Form } from "antd";

export const ChangeUserNameButton = () => {
    return (
        <Form.Item>
            <ConfigProvider wave={{ disabled: true }}>
                <Button type="primary" htmlType="submit" block>
                    ユーザー名を変更する
                </Button>
            </ConfigProvider>
        </Form.Item>
    );
};
