import React from "react";
import { Form, Input } from "antd";

export const ConfirmationCodeTextBox = () => {
    return (
        <Form.Item
            label="確認コード"
            name="confirmationCode"
            rules={[
                { required: true, message: "確認コードを入力してください" },
                {
                    pattern: /^\d+$/,
                    message: "確認コードは数値のみ入力してください"
                }
            ]}
            validateTrigger={["onBlur", "onSubmit"]}
        >
            <Input inputMode="numeric" maxLength={6} placeholder="123456" aria-label="確認コード" />
        </Form.Item>
    );
};
