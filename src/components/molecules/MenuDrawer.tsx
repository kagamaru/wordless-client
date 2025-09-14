import { Drawer, Avatar, Typography, List } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import {
    HomeOutlined,
    UserOutlined,
    BulbOutlined,
    DeleteOutlined,
    LogoutOutlined,
    CloseOutlined,
    LockOutlined
} from "@ant-design/icons";
import { User } from "@/@types";
import { css } from "ss/css";

const { Title, Text } = Typography;

type Props = {
    open: boolean;
    onClose: () => void;
    user: User;
};

export const MenuDrawer: React.FC<Props> = ({ open, onClose, user }) => {
    const router = useRouter();
    const isSampleUser =
        user.userId === process.env.NEXT_PUBLIC_SAMPLE_USER_NOZOMI_USER_ID ||
        user.userId === process.env.NEXT_PUBLIC_SAMPLE_USER_NICO_USER_ID;

    const closeIconStyle = css({
        fontSize: "24px",
        cursor: "pointer"
    });

    const userIdTextStyle = css({
        fontSize: "12px"
    });

    const listItemStyle = css({
        cursor: "pointer"
    });

    const onHomeClick = () => {
        router.push("/");
        onClose();
    };

    const onUserOwnPageClick = () => {
        router.push(`/user/${user.userId}`);
        onClose();
    };

    const onConceptClick = () => {
        router.push("/concept");
        onClose();
    };

    const onLogoutClick = () => {
        localStorage.removeItem("AccessToken");
        localStorage.removeItem("IdToken");
        router.push("/auth/login");
        onClose();
    };

    const onPasswordChangeClick = () => {
        router.push(`/user/${user.userId}/settings/password`);
        onClose();
    };

    return (
        <Drawer title={null} placement="left" open={open} width={280} closable={false}>
            <div>
                <CloseOutlined onClick={onClose} className={closeIconStyle} />
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar src={user.userAvatarUrl} size={80} alt={user.userName + "ProfileImage"} className="mb-3" />
                <div>
                    <Title level={4} className="ma-0">
                        {user.userName}
                    </Title>
                    <Text type="secondary" className={userIdTextStyle}>
                        {user.userId}
                    </Text>
                </div>
            </div>

            <List
                itemLayout="horizontal"
                dataSource={[
                    {
                        title: "ホーム",
                        icon: <HomeOutlined />,
                        onClick: onHomeClick,
                        danger: false
                    },
                    {
                        title: "自分のページ",
                        icon: <UserOutlined />,
                        onClick: onUserOwnPageClick,
                        danger: false
                    },
                    {
                        title: "コンセプト",
                        icon: <BulbOutlined />,
                        onClick: onConceptClick,
                        danger: false
                    },
                    {
                        title: "ログアウト",
                        icon: <LogoutOutlined />,
                        onClick: onLogoutClick,
                        danger: false
                    },
                    {
                        title: "パスワード変更",
                        icon: <LockOutlined />,
                        onClick: onPasswordChangeClick,
                        danger: false
                    },
                    {
                        title: "アカウント削除",
                        icon: <DeleteOutlined />,
                        // TODO: アカウント削除の実装をする
                        onClick: () => console.log("アカウント削除"),
                        danger: true
                    }
                ]}
                renderItem={(item) =>
                    (isSampleUser && item.title === "アカウント削除") ||
                    (isSampleUser && item.title === "パスワード変更") ? null : (
                        <List.Item onClick={item.onClick} className={listItemStyle}>
                            <List.Item.Meta
                                avatar={item.icon}
                                title={
                                    <span
                                        style={{
                                            color: item.danger ? "red" : "inherit",
                                            fontWeight: item.danger ? "bold" : undefined
                                        }}
                                    >
                                        {item.title}
                                    </span>
                                }
                            />
                        </List.Item>
                    )
                }
            />
        </Drawer>
    );
};
