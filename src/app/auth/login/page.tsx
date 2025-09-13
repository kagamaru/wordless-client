"use client";

import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { useMutation } from "@tanstack/react-query";
import { Form, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { css } from "ss/css";
import {
    DisplayErrorMessage,
    EmailAddressInput,
    LoginButton,
    PasswordInput,
    ResetPasswordLink,
    SampleLoginButton,
    SignupButton
} from "@/components/atoms";
import { getErrorMessage, postWithTimeout } from "@/helpers";
import { CardPageTemplate } from "@/components/template";

const env = process.env;

const sampleUsers = {
    Nozomi: {
        emailAddress: env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS,
        password: env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_PASSWORD
    },
    Nico: {
        emailAddress: env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS,
        password: env.NEXT_PUBLIC_SAMPLE_USER_NICO_PASSWORD
    }
};

export default function LoginSignup() {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState("login");
    const router = useRouter();

    const { mutateAsync, isError } = useMutation({
        mutationFn: async (request: { email: string; password: string }) => {
            const response = await postWithTimeout<AuthenticationResultType>(`/api/cognito/login`, {
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
                localStorage.setItem("AccessToken", loginResult.AccessToken ?? "");
            } else {
                throw new Error();
            }

            router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    const onSampleLoginClick = async (sampleUserName: "Nozomi" | "Nico") => {
        const userInfo = sampleUsers[sampleUserName];
        form.setFieldsValue({
            emailAddress: userInfo.emailAddress,
            password: userInfo.password
        });
        await onLoginClick();
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
                        error={{ errorCode: "COG-01", errorMessage: getErrorMessage("COG-01") }}
                    ></DisplayErrorMessage>
                )}
            </div>
            <Form form={form} onFinish={onLoginClick}>
                <EmailAddressInput />
                <PasswordInput />
                <LoginButton />
                <ResetPasswordLink />
                <SampleLoginButton sampleUserName="Nozomi" onClickAction={() => onSampleLoginClick("Nozomi")} />
                <SampleLoginButton sampleUserName="Nico" onClickAction={() => onSampleLoginClick("Nico")} />
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

    return (
        <>
            <CardPageTemplate>
                <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} centered></Tabs>
            </CardPageTemplate>
        </>
    );
}
