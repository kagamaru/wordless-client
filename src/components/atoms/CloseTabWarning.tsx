import { Typography } from "antd";
import { css } from "ss/css";

const { Text } = Typography;

export const CloseTabWarning = () => {
    const alertTextStyle = css({
        color: "red !important"
    });

    return <Text className={alertTextStyle}>ブラウザの×ボタンは押さないでください。</Text>;
};
