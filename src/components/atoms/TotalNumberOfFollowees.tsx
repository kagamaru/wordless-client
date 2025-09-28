import { Button, Row } from "antd";
import { css } from "ss/css";

type Props = {
    totalNumberOfFollowees: number;
    onClickAction: () => void;
};

export const TotalNumberOfFollowees: React.FC<Props> = ({ totalNumberOfFollowees, onClickAction }) => {
    const followButtonTextStyle = css({
        fontSize: 20
    });

    return (
        <Row align="middle" justify="center">
            <Button type="link" className="p-0 mr-1" aria-label="フォロワー数を表示" onClick={onClickAction}>
                <span className={followButtonTextStyle}>{totalNumberOfFollowees}</span>
            </Button>
            <div>フォロワー</div>
        </Row>
    );
};
