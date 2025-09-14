import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function SendEmailButton() {
    return (
        <Button type="primary" icon={<SendOutlined />}>
            メール送信
        </Button>
    );
}
