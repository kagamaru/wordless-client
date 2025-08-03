"use client";

import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { useMutation } from "@tanstack/react-query";
import { Card, Form, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { css } from "ss/css";
import {
    DisplayErrorMessage,
    EmailAddressInput,
    LoginButton,
    PasswordInput,
    ResetPasswordLink,
    SignupButton
} from "@/components/atoms";
import { getErrorMessage, postWithTimeout } from "@/helpers";
import { useIsMobile } from "@/hooks";

export default function LoginSignup() {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("login");
    const isMobile = useIsMobile();
    const router = useRouter();
    const { mutateAsync, isError } = useMutation({
        mutationFn: async (request: { email: string; password: string }) => {
            const response = await postWithTimeout<AuthenticationResultType>(`/api/auth`, {
                email: request.email,
                password: request.password
            });
            return response.data;
        }
    });

    const onLoginClick = async () => {
        try {
            await form.validateFields({
                recursive: true
            });
        } catch {
            return;
        }

        try {
            const loginResult = await mutateAsync({
                email: form.getFieldValue("emailAddress"),
                password: form.getFieldValue("password")
            });

            if (loginResult) {
                localStorage.setItem("IdToken", loginResult.IdToken ?? "");
            } else {
                throw new Error();
            }

            router.push("/");
        } catch (error) {
            console.error(error);
        }
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

    const alertBlockStyle = css({
        textAlign: "left"
    });

    const loginTab = (
        <>
            <div className={alertBlockStyle}>
                {isError && (
                    <DisplayErrorMessage
                        error={{ errorCode: "AUN-99", errorMessage: getErrorMessage("AUN-99") }}
                    ></DisplayErrorMessage>
                )}
            </div>
            <Form form={form} onFinish={onLoginClick}>
                <EmailAddressInput />
                <PasswordInput />
                <LoginButton />
                <ResetPasswordLink />
            </Form>
        </>
    );

    const signupTab = (
        <>
            <Form form={form}>
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

    const loginSignupPageStyle = css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "loginPageBackground"
    });

    const loginSignupPageBlockStyle = css({
        textAlign: "center"
    });

    const wordlessTitleStyle = css({
        color: "primary",
        fontSize: "48px",
        fontWeight: "bold"
    });

    const wordlessSubTitleStyle = css({
        marginBottom: "8px",
        fontSize: "16px",
        color: "grey"
    });

    const loginSignupCardStyle = css({
        width: isMobile ? "99%" : 500,
        margin: "auto",
        marginTop: 50
    });

    return (
        <>
            <div className={loginSignupPageStyle}>
                <div className={loginSignupPageBlockStyle}>
                    <div className={wordlessTitleStyle}>Wordless</div>
                    <div className={wordlessSubTitleStyle}>- 絵文字でつながるSNS -</div>
                    <Card className={loginSignupCardStyle}>
                        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
                    </Card>
                </div>
            </div>
        </>
    );
}
