"use client";

import { Form, Input } from "antd";

export function PasswordInput() {
    return (
        <Form.Item
            label="パスワード"
            name="password"
            rules={[
                { required: true, message: "パスワードを入力してください" },
                { min: 7, message: "パスワードは7文字以上で入力してください" },
                { pattern: /\d/, message: "パスワードには数字を含める必要があります" }
            ]}
        >
            <Input.Password />
        </Form.Item>
    );
}
