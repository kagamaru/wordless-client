import { Typography } from "antd";
import { css } from "ss/css";

const { Text } = Typography;

type Props = {
    reloadWarning?: boolean;
};

export const CloseTabWarning = ({ reloadWarning = false }: Props) => {
    const alertTextStyle = css({
        color: "red !important",
        display: "block"
    });

    return (
        <>
            <Text className={alertTextStyle}>ブラウザの×ボタンは押さないでください。</Text>
            {reloadWarning && <Text className={alertTextStyle}>ブラウザのリロードボタンは押さないでください。</Text>}
        </>
    );
};
