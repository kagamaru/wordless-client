import { CheckCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    isFollowing: boolean;
    onPostFollowButtonClickAction: () => void;
};

export const FixedFloatingFollowButton: React.FC<Props> = ({
    isFollowing,
    onPostFollowButtonClickAction: onFollowButtonClickAction
}) => {
    const isMobile = useIsMobile();
    const wrapperStyle = css({
        position: "fixed",
        bottom: isMobile ? 10 : 20,
        right: isMobile ? 6 : 40,
        zIndex: 2
    });

    const followButtonStyle = css({
        fontSize: isMobile ? "16px !important" : "24px !important",
        width: isMobile ? "120px !important" : "184px !important",
        height: isMobile ? "60px !important" : "88px !important",
        borderRadius: isMobile ? "30px !important" : "60px !important",
        backgroundColor: "white !important",
        color: "followBlue !important",
        fontWeight: "bold !important",
        border: "2px solid #1677FF !important"
    });

    const followingButtonStyle = css({
        fontSize: isMobile ? "16px !important" : "24px !important",
        width: isMobile ? "120px !important" : "184px !important",
        height: isMobile ? "60px !important" : "88px !important",
        borderRadius: isMobile ? "30px !important" : "60px !important",
        backgroundColor: "followBlue !important",
        color: "white !important",
        border: "none !important"
    });

    return (
        <>
            {/* NOTE: auto-scroll に関する警告の解消のため、直前にブロック要素を配置 */}
            <div></div>
            <div className={wrapperStyle}>
                {/* NOTE: ant-design5.X系がReact19に対応していないので、ConfigProviderを入れて対処する */}
                <ConfigProvider wave={{ disabled: true }}>
                    {isFollowing ? (
                        <Button shape="round" icon={<CheckCircleOutlined />} className={followingButtonStyle}>
                            フォロー中
                        </Button>
                    ) : (
                        <Button
                            shape="round"
                            icon={<UserAddOutlined />}
                            className={followButtonStyle}
                            onClick={onFollowButtonClickAction}
                        >
                            フォロー
                        </Button>
                    )}
                </ConfigProvider>
            </div>
        </>
    );
};
