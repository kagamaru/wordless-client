import React from "react";
import { Drawer, Avatar, Button, Row, ConfigProvider, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { css } from "ss/css";
import { User } from "@/@types";

type Props = {
    isOpen: boolean;
    users: User[];
    setIsOpen: (isOpen: boolean) => void;
};

export function ReactionUsersDrawer({ isOpen, users, setIsOpen }: Props) {
    const closeDrawer = () => setIsOpen(false);

    const drawerTitle = css({
        fontSize: 16,
        fontWeight: 600
    });

    const closeButton = css({
        display: "flex",
        justifyContent: "flex-end"
    });

    const userItem = css({
        display: "flex",
        alignItems: "center",
        marginBottom: 4,
        textDecoration: "none"
    });

    const userInfoText = css({
        marginLeft: 2,
        color: "black"
    });

    const userNameText = css({
        fontSize: 14,
        fontWeight: 600
    });

    const userIdText = css({
        fontSize: 12,
        color: "gray"
    });

    return (
        <>
            <Drawer placement="right" closable={false} onClose={closeDrawer} open={isOpen} width={300}>
                <Row justify="space-between" align="middle">
                    <div className={drawerTitle}>リアクションしたユーザー</div>
                    <div className={closeButton}>
                        {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                        <ConfigProvider wave={{ disabled: true }}>
                            <Button icon={<CloseOutlined />} onClick={closeDrawer} />
                        </ConfigProvider>
                    </div>
                </Row>
                <div style={{ padding: 16 }}>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <a key={user.userId} href={`/users/${user.userId}`} className={userItem}>
                                <Avatar src={user.userAvatarUrl} size={48} />
                                <div className={userInfoText}>
                                    <div className={userNameText}>{user.userName}</div>
                                    <div className={userIdText}>{user.userId}</div>
                                </div>
                            </a>
                        ))
                    ) : (
                        <Typography.Text>リアクションしたユーザーはいません。</Typography.Text>
                    )}
                </div>
            </Drawer>
        </>
    );
}
