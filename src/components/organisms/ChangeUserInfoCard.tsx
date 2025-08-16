import { Card } from "antd";
import { css } from "ss/css";

export const ChangeUserInfoCard = ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const changeUserInfoCardStyle = css({
        maxWidth: 560,
        margin: "24px auto !important",
        padding: 20
    });

    return <Card className={changeUserInfoCardStyle}>{children}</Card>;
};
