"use client";

import { Row, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ArrowBackButton, CardDivider, DeleteButton, DisplayErrorMessage } from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";
import { css } from "ss/css";
import { useMutation } from "@tanstack/react-query";
import { deleteNextjsServer, getHeader } from "@/helpers";
import { useError, useParamUserId } from "@/hooks";
import { useEffect } from "react";

const { Title, Text } = Typography;

export default function DeleteUser() {
    const router = useRouter();
    const userId = useParamUserId();
    const { handledError, handleErrors, hasError } = useError();

    const spaceStyle = css({
        width: "100%"
    });

    const {
        mutateAsync: deleteUserAsyncAPI,
        error: deleteUserError,
        isError: isDeleteUserError,
        isPending: isDeleteUserPending
    } = useMutation({
        mutationFn: async (userId: string) => {
            await deleteNextjsServer<void>(`/api/user/${userId}`, {}, getHeader());
        }
    });

    const onDeleteUserClick = async () => {
        try {
            await deleteUserAsyncAPI(userId);
        } catch (error) {
            console.error("onDeleteUserClickError");
        }
        router.push("/deleteUser/completion");
    };

    const onBackToTopButtonClick = () => {
        router.push("/");
    };

    useEffect(() => {
        const errors = [{ isError: isDeleteUserError, error: deleteUserError }];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                handleErrors(JSON.parse(error.message));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDeleteUserError, deleteUserError]);

    return (
        <>
            <ChangeUserInfoCard>
                <ArrowBackButton label="トップ画面に戻る" onClickAction={onBackToTopButtonClick} />
                <Title level={1} className="mt-4">
                    アカウント削除
                </Title>
                <CardDivider />
                {hasError && <DisplayErrorMessage error={handledError}></DisplayErrorMessage>}
                <Space direction="vertical" size={12} className={spaceStyle}>
                    <Text>アカウントを削除します。</Text>
                    <Text>削除したアカウントは戻せません。</Text>
                    <Row justify="end">
                        <DeleteButton onClickAction={onDeleteUserClick} isPending={isDeleteUserPending} />
                    </Row>
                </Space>
            </ChangeUserInfoCard>
        </>
    );
}
