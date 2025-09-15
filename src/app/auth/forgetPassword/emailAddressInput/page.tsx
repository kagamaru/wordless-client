"use client";

import { useMutation } from "@tanstack/react-query";
import { Form, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DisplayErrorMessage, EmailAddressInput, LinkButton, SendEmailButton } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { getErrorMessage, getHeader, postNextjsServer } from "@/helpers";

const { Title, Text } = Typography;

export default function EmailAddressInputPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [isSampleUserRegisterError, setIsSampleUserRegisterError] = useState(false);

    const {
        mutateAsync: postForgotPasswordAsyncAPI,
        isPending,
        isError
    } = useMutation({
        mutationFn: async (values: { email: string }) => {
            const response = await postNextjsServer<void>(
                `/api/cognito/forgotPassword`,
                {
                    email: values.email
                },
                getHeader()
            );
            return response;
        }
    });

    const onSendEmailClick = async (values: { emailAddress: string }) => {
        try {
            const emailAddress = values.emailAddress;
            if (
                emailAddress === process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS ||
                emailAddress === process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS
            ) {
                setIsSampleUserRegisterError(true);
                return;
            }

            await postForgotPasswordAsyncAPI({ email: emailAddress });
            router.push("/auth/forgetPassword/newPasswordInput");
        } catch {
            return;
        }
    };

    return (
        <CardPageTemplate>
            <Title level={2} className="mt-4">
                パスワードリセット
            </Title>
            <div className="mb-4">
                <p>
                    <Text>確認コードを送信します。</Text>
                </p>
                <p>
                    <Text>Eメールアドレスを入力してください。</Text>
                </p>
            </div>
            {(isError || isSampleUserRegisterError) && (
                <DisplayErrorMessage
                    error={{ errorCode: "COG-03", errorMessage: getErrorMessage("COG-03") }}
                    alignLeft={true}
                ></DisplayErrorMessage>
            )}
            <Form form={form} onFinish={onSendEmailClick}>
                <EmailAddressInput />
                <div className="mt-6">
                    <SendEmailButton isProcessing={isPending} />
                </div>
            </Form>
            <LinkButton label="ログイン画面に戻る" routerPath="/auth/login" />
        </CardPageTemplate>
    );
}
