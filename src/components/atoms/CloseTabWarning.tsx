import { Typography } from "antd";
import { css } from "ss/css";

const { Text } = Typography;

type Props = {
    reloadWarning?: boolean;
};

export const CloseTabWarning = ({ reloadWarning = false }: Props) => {
    const alertTextStyle = css({
        color: "red !important"
    });

    return (
        <div>
            <div>
                <Text className={alertTextStyle}>ブラウザの×ボタンは押さないでください。</Text>
            </div>
            {reloadWarning && (
                <div>
                    <Text className={alertTextStyle}>ブラウザのリロードボタンは押さないでください。</Text>
                </div>
            )}
        </div>
    );
};
