"use client";

import { Form, Input } from "antd";

type Props = {
    label?: string;
    name?: string;
};

export function PasswordInput({ label = "パスワード", name = "password" }: Props) {
    return (
        <Form.Item
            label={label}
            name={name}
            rules={[
                { required: true, message: "パスワードを入力してください" },
                { min: 7, message: "パスワードは7文字以上で入力してください" },
                { pattern: /\d/, message: "パスワードには数字を含める必要があります" }
            ]}
        >
            <Input.Password aria-label={label} />
        </Form.Item>
    );
}
