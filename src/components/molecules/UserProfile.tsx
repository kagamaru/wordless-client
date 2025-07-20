import { Avatar, Col, Row, Typography } from "antd";
import { css } from "ss/css";
import { User } from "@/@types";
import { useIsMobile } from "@/hooks";

const { Text } = Typography;

type Props = {
    userInfo: User;
};

export const UserProfile: React.FC<Props> = ({ userInfo }) => {
    const isMobile = useIsMobile();
    const { userName, userId, userAvatarUrl } = userInfo;
    const userNameTextStyle = css({
        fontSize: "24px !important",
        fontWeight: "bold"
    });

    return (
        <>
            <Row gutter={[16, 16]} align="middle" justify={isMobile ? "start" : "center"}>
                <Col>
                    <Avatar size={80} src={userAvatarUrl} />
                </Col>
                <Col>
                    <div className={isMobile ? "" : "ml-4"}>
                        <div>
                            <Text className={userNameTextStyle}>{userName}</Text>
                        </div>
                        <div>
                            <Text type="secondary">{userId}</Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};
