"use client";

import { useMutation } from "@tanstack/react-query";
import { Form, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    BaseButton,
    ConfirmationCodeTextBox,
    DisplayErrorMessage,
    EmailAddressInput,
    LinkButton,
    PasswordInput
} from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { getErrorMessage, getHeader, postNextjsServer } from "@/helpers";

const { Title, Text } = Typography;

export default function NewPasswordInputPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [isSampleUserRegisterError, setIsSampleUserRegisterError] = useState(false);

    const {
        mutateAsync: postConfirmForgotPasswordAsyncAPI,
        isPending,
        isError
    } = useMutation({
        mutationFn: async (values: { email: string; confirmationCode: string; newPassword: string }) => {
            const response = await postNextjsServer<void>(`/api/cognito/confirmForgotPassword`, values, getHeader());
            return response;
        }
    });

    const onPasswordChangeClick = async (values: {
        emailAddress: string;
        confirmationCode: string;
        newPassword: string;
    }) => {
        try {
            const emailAddress = values.emailAddress;
            const confirmationCode = values.confirmationCode;
            const newPassword = values.newPassword;
            if (
                emailAddress === process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_MAIL_ADDRESS ||
                emailAddress === process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_MAIL_ADDRESS
            ) {
                setIsSampleUserRegisterError(true);
                return;
            }

            await postConfirmForgotPasswordAsyncAPI({
                email: emailAddress,
                confirmationCode: confirmationCode,
                newPassword: newPassword
            });
            router.push("/auth/forgetPassword/completion");
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
                    <Text>パスワードを新しく登録します。</Text>
                </p>
                <p>
                    <Text>届いた確認コードを入力してください。</Text>
                </p>
            </div>
            {(isError || isSampleUserRegisterError) && (
                <DisplayErrorMessage
                    error={{ errorCode: "COG-04", errorMessage: getErrorMessage("COG-04") }}
                    alignLeft={true}
                ></DisplayErrorMessage>
            )}
            <Form form={form} onFinish={onPasswordChangeClick}>
                <EmailAddressInput />
                <PasswordInput label="新しいパスワード" name="newPassword" />
                <ConfirmationCodeTextBox />
                <div className="mt-6">
                    <BaseButton label="パスワード変更" loading={isPending} />
                </div>
            </Form>
            <LinkButton label="ログイン画面に戻る" routerPath="/auth/login" />
        </CardPageTemplate>
    );
}
