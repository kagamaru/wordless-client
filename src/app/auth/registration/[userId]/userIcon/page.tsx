"use client";

import { Typography } from "antd";
import { CardPageTemplate } from "@/components/template";
const { Title, Text } = Typography;

export default function RegistrationUserIconPage() {
    return (
        <CardPageTemplate>
            <Title level={2} className="mt-4">
                ユーザー登録
            </Title>
            <div className="mb-4">
                <p>
                    <Text>ユーザー画像を登録してください。</Text>
                </p>
            </div>
        </CardPageTemplate>
    );
}
