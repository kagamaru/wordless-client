"use client";

import { Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ArrowBackButton, CardDivider } from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";
import { css } from "ss/css";
import { ChangePasswordForm } from "@/components/molecules";

const { Title } = Typography;

export default function PasswordChange() {
    const router = useRouter();

    const spaceStyle = css({
        width: "100%"
    });

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
                <Space direction="vertical" size={12} className={spaceStyle}>
                    <ChangePasswordForm />
                </Space>
            </ChangeUserInfoCard>
        </>
    );
}
