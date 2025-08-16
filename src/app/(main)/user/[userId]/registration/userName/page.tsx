"use client";

import { Form, Row, Space } from "antd";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import {
    ArrowBackButton,
    CardDivider,
    ChangeUserNameButton,
    DisplayUserId,
    TopProfileAvatar,
    UserNameInput
} from "@/components/atoms";
import { ChangeUserInfoCard } from "@/components/organisms";
import { UserInfoContext } from "@/components/template";
import { css } from "ss/css";

export default function LoginSignup() {
    const [form] = Form.useForm();
    const router = useRouter();
    const userInfo = useContext(UserInfoContext)?.userInfo;
    if (!userInfo) {
        throw new Error("ユーザー情報がありません。");
    }

    const spaceStyle = css({
        width: "100%"
    });

    const onFinish = async (values: { username: string }) => {
        // ここでAPIコール等を行う想定
        console.log(`ユーザー名を「${values.username}」に変更しました。`);
    };

    const onBackButtonClick = () => {
        router.push(`/user/${userInfo.userId}`);
    };

    return (
        <>
            <ChangeUserInfoCard>
                <ArrowBackButton label="ユーザー情報表示に戻る" onClickAction={onBackButtonClick} />
                <CardDivider />
                <Space direction="vertical" size={12} className={spaceStyle}>
                    <Row justify="center">
                        <TopProfileAvatar userAvatarUrl={userInfo.userAvatarUrl} userName={userInfo.userName} />
                    </Row>
                    <CardDivider />
                    <DisplayUserId userId={userInfo.userId} />
                    <CardDivider />
                    {/* ユーザー名入力（入力時とクリック時にバリデーション） */}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        validateTrigger={["onChange", "onBlur"]}
                        requiredMark={false}
                        initialValues={{
                            username: userInfo.userName
                        }}
                    >
                        <UserNameInput />
                        <ChangeUserNameButton />
                    </Form>
                </Space>
            </ChangeUserInfoCard>
        </>
    );
}
