"use client";

import { useMutation } from "@tanstack/react-query";
import { Form, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BaseButton, CloseTabWarning, DisplayErrorMessage, UserIdInput, UserNameInput } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { useAuthInfoStore } from "@/store";
import { getHeader, postNextjsServer } from "@/helpers";
import { useError } from "@/hooks";
import { css } from "ss/css";

const { Title, Text } = Typography;

export default function RegistrationUserInfoPage() {
    const [form] = Form.useForm();
    const { handledError, handleErrors, hasError } = useError();
    const router = useRouter();

    const resetAuthInfo = useAuthInfoStore((state) => state.resetAuthInfo);

    const inputStyle = css({
        textAlign: "left"
    });

    const {
        mutateAsync: postUserAsyncAPI,
        error: postUserError,
        isError: isPostUserError,
        isPending: isPostUserPending
    } = useMutation({
        mutationFn: async (values: { userId: string; userName: string }) => {
            const response = await postNextjsServer<{ userId: string }>(
                `/api/user/${values.userId}`,
                {
                    userName: values.userName
                },
                getHeader()
            );
            return response.data;
        }
    });

    const onFinish = async (values: { userId: string; userName: string }) => {
        try {
            const response = await postUserAsyncAPI({
                userId: "@" + values.userId,
                userName: values.userName
            });
            router.push(`/auth/registration/${response.userId}/userIcon`);
        } catch (error) {
            console.error(error);
            return;
        }
    };

    useEffect(() => {
        if (isPostUserError && postUserError) {
            handleErrors(JSON.parse(postUserError.message));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postUserError, isPostUserError]);

    useEffect(() => {
        resetAuthInfo();
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
                {hasError && <DisplayErrorMessage error={handledError} alignLeft={true}></DisplayErrorMessage>}
                <Form className={inputStyle} form={form} onFinish={onFinish}>
                    <UserIdInput />
                    <UserNameInput />
                    <BaseButton label="ユーザー登録" loading={isPostUserPending} />
                </Form>
            </div>
        </CardPageTemplate>
    );
}
