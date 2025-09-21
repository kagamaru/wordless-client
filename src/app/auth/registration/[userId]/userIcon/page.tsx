"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/@types";
import { BaseButton, ChangeImageButton, DisplayErrorMessage } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { fetchNextjsServer, getHeader } from "@/helpers";
import { useError, useParamUserId } from "@/hooks";

const { Title, Text } = Typography;

export default function RegistrationUserIconPage() {
    const userId = useParamUserId();
    const { handledError, handleErrors, hasError } = useError();
    const router = useRouter();

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

    const onChangeImageClick = () => {
        // TODO: ユーザー画像変更APIを呼び出す
        console.log("onChangeImageClick");
    };

    const onWordlessStartClick = () => {
        router.push("/");
    };

    useEffect(() => {
        if (isUserInfoError && userInfoError) {
            handleErrors(JSON.parse(userInfoError.message));
        }
    }, [isUserInfoError, userInfoError]);

    return (
        <CardPageTemplate>
            <Title level={2} className="mt-4">
                ユーザー登録
            </Title>
            <div className="mb-4">
                <p>
                    <Text>ユーザー画像を登録してください。（任意）</Text>
                </p>
            </div>
            {hasError && <DisplayErrorMessage error={handledError} alignLeft={true}></DisplayErrorMessage>}
            <div className="mb-3">
                <Avatar src={userInfo?.userAvatarUrl} alt={userInfo?.userName + "のユーザー画像"} size={88} />
            </div>
            <ChangeImageButton isLoading={false} onClick={onChangeImageClick} />
            <BaseButton label="Wordlessを始める" loading={false} onClick={onWordlessStartClick} />
        </CardPageTemplate>
    );
}
