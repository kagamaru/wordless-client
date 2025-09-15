"use client";

import { Typography } from "antd";
import { CloseTabWarning } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";

const { Title, Text } = Typography;

export default function RegistrationUserInfoPage() {
    return (
        <>
            <CardPageTemplate>
                <Title level={2} className="mt-4">
                    ユーザー登録
                </Title>
                <div className="mb-4">
                    <p>
                        <Text>ユーザーIDとユーザー名を登録してください。</Text>
                    </p>
                    <p>
                        <CloseTabWarning />
                    </p>
                </div>
            </CardPageTemplate>
        </>
    );
}
