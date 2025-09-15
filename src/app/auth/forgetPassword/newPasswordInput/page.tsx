"use client";

import { Form, Typography } from "antd";
import { BaseButton, ConfirmationCodeTextBox, EmailAddressInput, LinkButton, PasswordInput } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function NewPasswordInputPage() {
    const [form] = Form.useForm();

    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    パスワードリセット
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>パスワードを新しく登録します。</Text>
                    </p>
                    <p>
                        <Text>届いた確認コードを入力してください。</Text>
                    </p>
                </div>
                <Form form={form} onFinish={() => {}}>
                    <EmailAddressInput />
                    <PasswordInput label="新しいパスワード" name="newPassword" />
                    <ConfirmationCodeTextBox />
                    <div className="mt-6">
                        <BaseButton label="パスワード変更" loading={false} />
                    </div>
                </Form>
                <LinkButton label="ログイン画面に戻る" routerPath="/auth/login" />
            </CardPageTemplate>
        </>
    );
}
