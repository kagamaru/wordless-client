"use client";

import { useMutation } from "@tanstack/react-query";
import { Form, Typography } from "antd";
import { useRouter } from "next/navigation";
import { BaseButton, CloseTabWarning, ConfirmationCodeTextBox, DisplayErrorMessage } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { getErrorMessage, getHeader, postNextjsServer } from "@/helpers";
import { useAuthInfoStore } from "@/store";

const { Title, Text } = Typography;

export default function RegistrationConfirmationCodePage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const authInfo = useAuthInfoStore((state) => state.authInfo);

    const {
        mutateAsync: postConfirmSignupAsyncAPI,
        isPending,
        isError
    } = useMutation({
        mutationFn: async (values: { email: string; confirmationCode: string }) => {
            const response = await postNextjsServer<void>(`/api/cognito/confirmSignup`, values, getHeader());
            return response;
        }
    });

    const onConfirmClick = async (values: { confirmationCode: string }) => {
        try {
            const { email } = authInfo;
            const confirmationCode = values.confirmationCode;
            await postConfirmSignupAsyncAPI({ email, confirmationCode });
            router.push("/auth/registration/userInfo");
        } catch {
            return;
        }
    };

    return (
        <CardPageTemplate>
            <Title level={2} className="mt-4">
                ユーザー登録
            </Title>
            <div className="mb-4">
                <p>
                    <Text>メールアドレスと確認コードを入力してください。</Text>
                </p>
                <CloseTabWarning reloadWarning={true} />
                {isError && (
                    <DisplayErrorMessage
                        error={{ errorCode: "COG-06", errorMessage: getErrorMessage("COG-06") }}
                        alignLeft={true}
                    ></DisplayErrorMessage>
                )}
                <Form form={form} onFinish={onConfirmClick}>
                    <div className="mt-6">
                        <ConfirmationCodeTextBox />
                    </div>
                    <div className="mt-6">
                        <BaseButton label="確認コードを検証" loading={isPending} />
                    </div>
                </Form>
            </div>
        </CardPageTemplate>
    );
}
