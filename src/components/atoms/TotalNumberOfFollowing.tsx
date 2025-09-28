import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfFollowing: number;
    onClickAction: () => void;
};

export const TotalNumberOfFollowing: React.FC<Props> = ({ totalNumberOfFollowing, onClickAction }) => {
    const followButtonTextStyle = css({
        fontSize: 20
    });

    return (
        <Row align="middle" justify="center">
            <Button type="link" className="p-0 mr-1" aria-label="フォロー数を表示" onClick={onClickAction}>
                <span className={followButtonTextStyle}>{totalNumberOfFollowing}</span>
            </Button>
            <div>フォロー</div>
        </Row>
    );
};
