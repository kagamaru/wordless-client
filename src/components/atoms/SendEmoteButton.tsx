import { SendOutlined } from "@ant-design/icons";
import { useIsMobile } from "@/hooks";
import { css } from "ss/css";

type Props = {
    disabled: boolean;
    onSendClick: () => void;
};

export function SendEmoteButton({ disabled, onSendClick }: Props) {
    const isMobile = useIsMobile();

    const sendButtonStyle = css({
        fontSize: isMobile ? "32px" : "56px",
        color: disabled ? "grey !important" : "primary !important",
        cursor: disabled ? "not-allowed !important" : "pointer",
        opacity: disabled ? 0.5 : 1
    });

    return (
        <div
            role="button"
            aria-label="エモート送信ボタン"
            aria-disabled={disabled}
            onClick={disabled ? undefined : onSendClick}
        >
            <SendOutlined className={sendButtonStyle} />
        </div>
    );
}
