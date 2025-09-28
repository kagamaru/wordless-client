import { Typography } from "antd";
import { css } from "ss/css";

type Props = {
    userId: string;
};

export const DisplayUserId = ({ userId }: Props) => {
    const displayUserIdStyle = css({
        marginTop: "8px !important"
    });

    return (
        <>
            <Typography.Text type="secondary">ユーザーID：</Typography.Text>
            <Typography.Title level={4} className={displayUserIdStyle}>
                {userId}
            </Typography.Title>
        </>
    );
};
