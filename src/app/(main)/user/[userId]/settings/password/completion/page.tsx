"use client";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { ArrowBackButton, CardDivider } from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";

const { Title, Text } = Typography;

export default function PasswordChangeCompletion() {
    const router = useRouter();

    const onBackToTopButtonClick = () => {
        router.push("/");
    };

    return (
        <>
            <ChangeUserInfoCard>
                <ArrowBackButton label="トップ画面に戻る" onClickAction={onBackToTopButtonClick} />
                <Title level={1} className="mt-4">
                    パスワード変更
                </Title>
                <CardDivider />
                <Text>パスワードが変更されました。</Text>
            </ChangeUserInfoCard>
        </>
    );
}
