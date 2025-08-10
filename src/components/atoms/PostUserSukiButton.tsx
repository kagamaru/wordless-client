import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    isProcessing: boolean;
    onSendClick: () => void;
};

export function PostUserSukiButton({ isProcessing, onSendClick }: Props) {
    const isMobile = useIsMobile();

    const sendButtonStyle = css({
        fontSize: isMobile ? "32px" : "56px",
        color: "primary !important",
        cursor: "pointer",
        opacity: 1
    });

    const loadingOutlinedStyle = css({
        fontSize: isMobile ? "32px" : "56px",
        color: "primary !important"
    });

    return (
        <div role="button" aria-label="ユーザースキ登録ボタン" aria-disabled={isProcessing} onClick={onSendClick}>
            {isProcessing ? (
                <LoadingOutlined className={loadingOutlinedStyle} />
            ) : (
                <SendOutlined className={sendButtonStyle} />
            )}
        </div>
    );
}
