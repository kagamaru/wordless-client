import { Avatar, Col, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { User } from "@/@types";
import { EditButton, SyncButton } from "@/components/atoms";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

const { Text } = Typography;

type Props = {
    userInfo: User;
    onUserImageChangeClick: (fileData: FormData) => Promise<void>;
};

export const CurrentUserProfile: React.FC<Props> = ({ userInfo, onUserImageChangeClick }) => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { userName, userId, userAvatarUrl } = userInfo;

    const userNameTextStyle = css({
        fontSize: "24px !important",
        fontWeight: "bold"
    });

    const onUserNameChangeClick = () => {
        router.push(`/user/${userId}/registration/userName`);
    };

    return (
        <>
            <Row gutter={[16, 16]} align="middle" justify={isMobile ? "start" : "center"}>
                <Col>
                    <Row align="top">
                        <Avatar size={80} src={userAvatarUrl} alt={userName + "のトッププロフィール画像"} />
                        <SyncButton onClickAction={onUserImageChangeClick} />
                    </Row>
                </Col>
                <Col>
                    <div className={isMobile ? "" : "ml-4"}>
                        <div>
                            <Text className={userNameTextStyle} aria-label={userName}>
                                {userName}
                            </Text>
                        </div>
                        <div>
                            <Text type="secondary" aria-label={userId}>
                                {userId}
                            </Text>
                        </div>
                    </div>
                </Col>
                <Col>
                    <EditButton ariaLabel="ユーザー名変更ボタン" onClickAction={onUserNameChangeClick} />
                </Col>
            </Row>
        </>
    );
};
