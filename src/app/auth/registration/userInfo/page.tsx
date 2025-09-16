"use client";

import { Form, Typography } from "antd";
import { useEffect } from "react";
import { BaseButton, CloseTabWarning, UserIdInput, UserNameInput } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { css } from "ss/css";
import { useAuthInfoStore } from "@/store";

const { Title, Text } = Typography;

export default function RegistrationUserInfoPage() {
    const [form] = Form.useForm();

    const inputStyle = css({
        textAlign: "left"
    });

    useEffect(() => {
        useAuthInfoStore.getState().cleanAllData();
    }, []);

    return (
        <CardPageTemplate>
            <Title level={2} className="mt-4">
                ユーザー登録
            </Title>
            <div className="mb-4">
                <p>
                    <Text>ユーザーIDとユーザー名を登録してください。</Text>
                </p>
                <p className="mb-3">
                    <CloseTabWarning />
                </p>
                <Form className={inputStyle} form={form} onFinish={() => {}}>
                    <UserIdInput />
                    <UserNameInput />
                    <BaseButton label="ユーザー登録" loading={false} />
                </Form>
            </div>
        </CardPageTemplate>
    );
}
