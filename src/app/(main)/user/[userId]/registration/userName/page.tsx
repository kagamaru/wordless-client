"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/@types";
import {
    ArrowBackButton,
    CardDivider,
    ChangeUserNameButton,
    DisplayErrorMessage,
    DisplayUserId,
    TopProfileAvatar,
    UserNameInput
} from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";
import { fetchNextjsServer, getHeader, postNextjsServer } from "@/helpers";
import { useError, useParamUserId } from "@/hooks";
import { css } from "ss/css";

export default function LoginSignup() {
    const [form] = Form.useForm();
    const { handledError, handleErrors, hasError } = useError();
    const router = useRouter();
    const userId = useParamUserId();

    const spaceStyle = css({
        width: "100%"
    });

    // NOTE: 常に最新のユーザー情報を取得する
    const {
        data: userInfo,
        isError: isUserInfoError,
        error: userInfoError
    } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const response = await fetchNextjsServer<User>(`/api/user/${userId}`, getHeader());
            return response.data;
        }
    });

    const {
        mutateAsync: postUserNameAsyncAPI,
        error: postUserNameError,
        isError: isPostUserNameError
    } = useMutation({
        mutationFn: async (userName: string) => {
            await postNextjsServer<void>(
                `/api/userName/${userId}`,
                {
                    userName
                },
                getHeader()
            );
        }
    });

    const onFinish = async (values: { userName: string }) => {
        await postUserNameAsyncAPI(values.userName);
        router.push(`/user/${userId}`);
    };

    const onBackButtonClick = () => {
        router.push(`/user/${userId}`);
    };

    useEffect(() => {
        const errors = [
            { isError: isUserInfoError, error: userInfoError },
            { isError: isPostUserNameError, error: postUserNameError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                handleErrors(JSON.parse(error.message));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserInfoError, userInfoError, isPostUserNameError, postUserNameError]);

    return (
        <>
            {hasError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
            {userInfo && (
                <ChangeUserInfoCard>
                    <ArrowBackButton label="ユーザー情報表示に戻る" onClickAction={onBackButtonClick} />
                    <CardDivider />
                    <Space direction="vertical" size={12} className={spaceStyle}>
                        <Row justify="center">
                            <TopProfileAvatar userAvatarUrl={userInfo.userAvatarUrl} userName={userInfo.userName} />
                        </Row>
                        <CardDivider />
                        <DisplayUserId userId={userId} />
                        <CardDivider />
                        {/* ユーザー名入力（入力時とクリック時にバリデーション） */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            validateTrigger={["onChange", "onBlur"]}
                            requiredMark={false}
                            initialValues={{
                                userName: userInfo.userName
                            }}
                        >
                            <UserNameInput />
                            <ChangeUserNameButton />
                        </Form>
                    </Space>
                </ChangeUserInfoCard>
            )}
        </>
    );
}
