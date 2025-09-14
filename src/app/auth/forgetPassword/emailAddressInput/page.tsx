"use client";

import { Form, Typography } from "antd";
import { EmailAddressInput, LinkButton, SendEmailButton } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function EmailAddressInputPage() {
    const [form] = Form.useForm();

    const onSendEmailClick = async () => {
        try {
            const emailAddress = form.getFieldValue("emailAddress");
            console.log(emailAddress);
        } catch {
            return;
        }
    };

    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    パスワードリセット
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>確認コードを送信します。</Text>
                    </p>
                    <p>
                        <Text>Eメールアドレスを入力してください。</Text>
                    </p>
                </div>
                <Form form={form} onFinish={onSendEmailClick}>
                    <EmailAddressInput />
                    <div className="mt-6">
                        <SendEmailButton />
                    </div>
                </Form>
                <LinkButton label="ログイン画面に戻る" routerPath="/auth/login" />
            </CardPageTemplate>
        </>
    );
}
