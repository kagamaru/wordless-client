"use client";

import { Typography } from "antd";
import { LinkButton } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function ForgetPasswordCompletionPage() {
    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    パスワードリセット
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>パスワードが変更されました。</Text>
                    </p>
                    <p>
                        <Text>ログイン画面に戻ってください。</Text>
                    </p>
                </div>
                <LinkButton label="ログイン画面に戻る" routerPath="/auth/login" />
            </CardPageTemplate>
        </>
    );
}
