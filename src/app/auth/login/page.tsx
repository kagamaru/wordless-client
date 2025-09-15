"use client";

import { Form, Tabs } from "antd";
import { useState } from "react";
import { BaseButton, EmailAddressInput, LinkButton, PasswordInput } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { LoginTab } from "@/components/molecules";

export default function LoginSignup() {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("login");

    // TODO: 後続で実装する
    // const onSignupClick = async (email: string, password: string) => {
    //     try {
    //         await form.validateFields();
    //     } catch {
    //         return;
    //     }
    //     // await authService.signup(email, password);
    // };

    const signupTab = (
        <>
            <Form form={form}>
                <EmailAddressInput />
                <PasswordInput />
                <BaseButton label="ユーザー登録" loading={false} />
                <LinkButton label="パスワードを忘れた場合" routerPath="/auth/forgetPassword/emailAddressInput" />
            </Form>
        </>
    );

    const tabItems = [
        {
            key: "login",
            label: "ログイン",
            children: <LoginTab />
        },
        {
            key: "signup",
            label: "ユーザー登録",
            children: signupTab
        }
    ];

    return (
        <>
            <CardPageTemplate>
                <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
            </CardPageTemplate>
        </>
    );
}
