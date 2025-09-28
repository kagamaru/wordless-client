"use client";

import { Form, Input } from "antd";

export function EmailAddressInput() {
    return (
        <Form.Item
            label="Eメール"
            name="email"
            rules={[
                { required: true, message: "Eメールを入力してください" },
                { type: "email", message: "有効なEメールを入力してください" }
            ]}
        >
            <Input title="Eメール" aria-label="Eメール" />
        </Form.Item>
    );
}
