"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User } from "@/@types";
import { BaseButton, ChangeImageButton, DisplayErrorMessage } from "@/components/atoms";
import { CardPageTemplate } from "@/components/template";
import { fetchNextjsServer, getHeader, postImageNextjsServer } from "@/helpers";
import { useError, useParamUserId } from "@/hooks";

const { Title, Text } = Typography;

export default function RegistrationUserIconPage() {
    const userId = useParamUserId();
    const { handledError, handleErrors, hasError } = useError();
    const router = useRouter();

    const {
        data: userInfo,
        refetch: fetchUserInfoAsyncAPI,
        isError: isUserInfoError,
        error: userInfoError,
        isPending: isUserInfoPending
    } = useQuery({
        queryKey: ["userInfo"],
        queryFn: async () => {
            const response = await fetchNextjsServer<User>(`/api/user/${userId}`, getHeader());
            return response.data;
        }
    });

    const {
        mutateAsync: postUserImageAsyncAPI,
        isError: isPostUserImageError,
        error: postUserImageError,
        isPending: isPostUserImagePending
    } = useMutation({
        mutationFn: async (fileData: FormData) => {
            await postImageNextjsServer<void>(`/api/userImage/${userInfo?.userId}`, fileData, {
                headers: {
                    authorization: localStorage.getItem("IdToken") ?? ""
                }
            });
        }
    });

    const onChangeImageClick = async (file: File) => {
        if (!file || file.size === 0) return;

        const form = new FormData();
        form.append("file", file, file.name);

        try {
            await postUserImageAsyncAPI(form);
        } catch {
            console.error("Post Image Failed");
        }
        try {
            await fetchUserInfoAsyncAPI();
        } catch {
            console.error("Fetch User Info Failed");
        }
    };

    const onWordlessStartClick = () => {
        router.push("/");
    };

    useEffect(() => {
        const errors = [
            { isError: isUserInfoError, error: userInfoError },
            { isError: isPostUserImageError, error: postUserImageError }
        ];

        errors.forEach(({ isError, error }) => {
            if (isError && error) {
                handleErrors(JSON.parse(error.message));
            }
        });
    }, [isUserInfoError, userInfoError, isPostUserImageError, postUserImageError]);

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
            <ChangeImageButton isLoading={isPostUserImagePending || isUserInfoPending} onClick={onChangeImageClick} />
            <BaseButton label="Wordlessを始める" loading={false} onClick={onWordlessStartClick} />
        </CardPageTemplate>
    );
}
