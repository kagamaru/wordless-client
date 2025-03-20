"use client";

import { AuthService } from "@/api";
import { EmailAddressInput, LoginButton, PasswordInput, ResetPasswordLink, SignupButton } from "@/components/atoms";
import { useIsMobile } from "@/hooks";
import { Card, Form, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { css } from "ss/css";

export default function LoginSignup() {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("login");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const isMobile = useIsMobile();
    const router = useRouter();

    const authService = new AuthService();

    const handleValuesChange = (changedValues: { emailAddress: string; password: string }) => {
        if (changedValues.emailAddress) {
            setEmailAddress(changedValues.emailAddress);
        } else if (changedValues.password) {
            setPassword(changedValues.password);
        }
    };

    const onLoginClick = async (email: string, password: string) => {
        try {
            await form.validateFields({
                recursive: true
            });
        } catch {
            return;
        }

        await authService.signin(email, password);
        router.push("/");
    };

    // TODO: 後続で実装する
    // const onSignupClick = async (email: string, password: string) => {
    //     try {
    //         await form.validateFields();
    //     } catch {
    //         return;
    //     }
    //     // await authService.signup(email, password);
    // };

    const loginTab = (
        <>
            <Form form={form} onValuesChange={handleValuesChange} onFinish={() => onLoginClick(emailAddress, password)}>
                <EmailAddressInput />
                <PasswordInput />
                <LoginButton />
                <ResetPasswordLink />
            </Form>
        </>
    );

    const signupTab = (
        <>
            <Form form={form} onValuesChange={handleValuesChange}>
                <EmailAddressInput />
                <PasswordInput />
                <SignupButton />
                <ResetPasswordLink />
            </Form>
        </>
    );

    const tabItems = [
        {
            key: "login",
            label: "ログイン",
            children: loginTab
        },
        {
            key: "signup",
            label: "ユーザー登録",
            children: signupTab
        }
    ];

    const loginSignupPage = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, rgba(220, 198, 224, 0.8), rgba(165, 180, 252, 0.8))"
    });

    const loginSignupPageBlock = css({
        textAlign: "center"
    });

    const wordlessTitle = css({
        color: "primary",
        fontSize: "48px",
        fontWeight: "bold"
    });

    const wordlessSubTitle = css({
        marginBottom: "8px",
        fontSize: "16px",
        color: "grey"
    });

    const loginSignupCard = css({
        width: isMobile ? "99%" : 500,
        margin: "auto !important",
        marginTop: 50
    });

    return (
        <>
            <div className={loginSignupPage}>
                <div className={loginSignupPageBlock}>
                    <div className={wordlessTitle}>Wordless</div>
                    <div className={wordlessSubTitle}>- 絵文字でつながるSNS -</div>
                    <Card className={loginSignupCard}>
                        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
                    </Card>
                </div>
            </div>
        </>
    );
}
