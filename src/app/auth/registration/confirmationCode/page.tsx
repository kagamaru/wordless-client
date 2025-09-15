"use client";

import { Form, Typography } from "antd";
import { BaseButton, CloseTabWarning, ConfirmationCodeTextBox, EmailAddressInput } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function RegistrationConfirmationCodePage() {
    const [form] = Form.useForm();

    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    ユーザー登録
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>メールアドレスと確認コードを入力してください。</Text>
                    </p>
                    <p>
                        <CloseTabWarning />
                    </p>
                    <Form form={form} onFinish={() => {}}>
                        <div className="mt-6">
                            <EmailAddressInput />
                            <ConfirmationCodeTextBox />
                        </div>
                        <div className="mt-6">
                            <BaseButton label="確認コードを検証" loading={false} />
                        </div>
                    </Form>
                </div>
            </CardPageTemplate>
        </>
    );
}
