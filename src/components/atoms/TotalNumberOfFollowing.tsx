import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfFollowing: number;
};

export const TotalNumberOfFollowing: React.FC<Props> = ({ totalNumberOfFollowing }) => {
    const followButtonTextStyle = css({
        fontSize: 20
    });

    return (
        <Row align="middle" justify="center">
            <Button type="link" className="p-0 mr-1" onClick={() => console.log("フォロー一覧")}>
                <span className={followButtonTextStyle}>{totalNumberOfFollowing}</span>
            </Button>
            <div>フォロー</div>
        </Row>
    );
};
