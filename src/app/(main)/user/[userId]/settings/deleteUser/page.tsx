"use client";

import { Row, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ArrowBackButton, CardDivider, DeleteButton } from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";
import { css } from "ss/css";

const { Title, Text } = Typography;

export default function DeleteUser() {
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
                    アカウント削除
                </Title>
                <CardDivider />
                <Space direction="vertical" size={12} className={spaceStyle}>
                    <Text>アカウントを削除します。</Text>
                    <Text>削除したアカウントは戻せません。</Text>
                    <Row justify="end">
                        <DeleteButton onClickAction={() => {}} isPending={false} />
                    </Row>
                </Space>
            </ChangeUserInfoCard>
        </>
    );
}
