"use client";

import { Typography } from "antd";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function RegistrationConfirmationCodePage() {
    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    ユーザー登録
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>確認コードを入力してください。</Text>
                    </p>
                </div>
            </CardPageTemplate>
        </>
    );
}
